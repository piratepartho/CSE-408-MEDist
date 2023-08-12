import { FC } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LoginCardForm, LoginCardFormType } from "@/models/FormSchema";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const onLoginSubmit: SubmitHandler<LoginCardFormType> = async (
  data
): Promise<any> => {
  const response = await axios.post(
    `${import.meta.env.VITE_DB_URL}:${
      import.meta.env.VITE_DB_PORT
    }/api/auth/login`,
    data
  );
  console.log(response.data);
  return response.data;
};

const LoginCard: FC = () => {
  const loginForms = useForm<LoginCardFormType>({
    defaultValues: {
        email:"",
        password:"",
        role:"",
    },
    resolver: zodResolver(LoginCardForm),
  });

  return (
    <>
      <Card>
        <CardContent className="space-y-2 mt-2">
          <form onSubmit={loginForms.handleSubmit(onLoginSubmit)}>
            <Controller
              name="email"
              control={loginForms.control}
              render={({ field }) => (
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input {...field} placeholder="Email" />
                </div>
              )}
            />
            <Controller
              name="password"
              control={loginForms.control}
              render={({ field }) => (
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input {...field} placeholder="Password"></Input>
                </div>
              )}
            />

            <div className="space-y-1">
              <Label htmlFor="loginAs">Login As</Label>
              <Controller
                name="role"
                control={loginForms.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="patient">Patient</SelectItem>
                      <SelectItem value="assistant">Assistant</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex justify-center">
              <Button
                className="bg-c1 text-white hover:bg-c2 mt-4"
                type="submit"
              >
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default LoginCard;
