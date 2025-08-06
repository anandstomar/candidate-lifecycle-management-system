
import { IUser } from '../../models/authModel';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
