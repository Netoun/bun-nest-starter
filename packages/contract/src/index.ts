import { initContract } from "@ts-rest/core";
import { todoContract } from "./todo.contract";
import { userContract } from "./user.contract";

const c = initContract();

export default c.router({
  user: userContract,
  todo: todoContract,
});
