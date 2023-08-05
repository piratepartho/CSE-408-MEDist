import { AllGenericInfo } from "@/models/Brand";
import { FC } from "react";
import { Link } from "react-router-dom";
//render list of generics

const GenericList: FC<{ genericList: AllGenericInfo[] }> = (props) => {
  return (
    <div>
      {props.genericList.map((generic) => (
        <div>
          <div className="m-2 p-2 border border-c2 rounded-md whitespace-nowrap overflow-hidden">
            <Link to={`/generic/${generic.Generic.id}`}>
              <div className="font-bold text-c1">{generic.Generic.name}</div>
            </Link>
            <div className="opacity-50">{generic.Generic.type}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GenericList;
