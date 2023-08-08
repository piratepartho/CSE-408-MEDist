// external imports
import createHttpError from "http-errors";

//internal imports
import { Signup_or_Login_Body_Input } from "../schema/auth.schema";
import userRepository, {
  UserRepositoryInterface,
} from "../database/repository/user.repository";

import broker, {
  RPC_Request_Payload,
  RPC_Response_Payload,
} from "../utils/broker";
import { config } from "../config";
import jwtService, { JWT_Payload } from "../utils/jwt";
import { UserRole } from "../database/models/User.model";

// ============================== UserService ============================== //

export interface UserServiceInterface {
  SignUp(userInput: Signup_or_Login_Body_Input): Promise<string>;
  LogIn(userInput: Signup_or_Login_Body_Input): Promise<string>;
  serveRPCRequest(payload: RPC_Request_Payload): Promise<RPC_Response_Payload>;
  authorizeUser(token: string): Promise<RPC_Response_Payload>;
}

class UserService implements UserServiceInterface {
  private repository: UserRepositoryInterface;

  constructor() {
    this.repository = userRepository;
  }

  private async requestID_fromOtherServices(
    role: string,
    payload: RPC_Request_Payload
  ): Promise<number> {
    let response: RPC_Response_Payload;

    if (role === UserRole.PATIENT) {
      response = await broker.RPC_Request(config.PATIENT_RPC_QUEUE, payload);
    } else if (role === UserRole.DOCTOR) {
      response = await broker.RPC_Request(config.DOCTOR_RPC_QUEUE, payload);
    }

    let ID: number = NaN;

    if (response && response.status === "success") {
      ID = response.data["ID"];
    }

    return ID;
  }

  // ----------------------------------------- SignUP ------------------------------------------ //
  async SignUp(userInput: Signup_or_Login_Body_Input) {
    const { email, password, role } = userInput;

    const existingUser = await this.repository.findUserByEmail(email);

    if (existingUser)
      throw createHttpError(409, `User with email ${email} already exists`);

    const newUser = await this.repository.createUser(userInput);

    // send RPC request to get Id from other service
    const payload: RPC_Request_Payload = {
      type: "CREATE_NEW_ENTITY",
      data: {
        userID: newUser.id,
      },
    };

    const ID: number = await this.requestID_fromOtherServices(role, payload);

    if (isNaN(ID)) {
      await this.repository.deleteUserById(newUser.id);
      throw createHttpError(500, "Failed to create user");
    }

    // generate JWT token
    const token_payload: JWT_Payload = {
      id: ID,
      email: email,
      role: role,
    };

    const token = await jwtService.generateToken(token_payload);

    return token;
  }

  async LogIn(userInput: Signup_or_Login_Body_Input) {
    const { email, password, role } = userInput;

    const existingUser = await this.repository.findUserByEmail_and_Password(
      email,
      password
    );

    if (!existingUser) throw createHttpError(400, "invalid email or password");

    // send RPC request to get Id from other service
    const payload: RPC_Request_Payload = {
      type: "GET_ID",
      data: {
        userID: existingUser.id,
      },
    };

    const ID: number = await this.requestID_fromOtherServices(role, payload);

    if (isNaN(ID)) throw createHttpError(500, "Service Communication Failure");

    // generate JWT token
    const token_payload: JWT_Payload = {
      id: ID,
      email: email,
      role: role,
    };

    const token = await jwtService.generateToken(token_payload);

    return token;
  }


  // ----------------------------------------- Authorize User ------------------------------------------ //
  async authorizeUser(token: string): Promise<RPC_Response_Payload> {
    try {
      const payload = await jwtService.verifyToken(token);

      if (!payload) {
        return {
          status: "unauthorized",
          data: {},
        };
      } else {
        return {
          status: "success",
          data: {
            ...payload,
          },
        };
      }
    } catch (error) {
      return {
        status: "error",
        data: {},
      };
    }
  }

  // server side RPC request handler
  async serveRPCRequest(payload: RPC_Request_Payload) {
    let response: RPC_Response_Payload = {
      status: "error",
      data: {},
    };
    switch (payload.type) {
      case "AUTHORIZATION":
        return await this.authorizeUser(payload.data["token"]);
      default:
        break;
    }

    return response;
  }
}

export default new UserService();