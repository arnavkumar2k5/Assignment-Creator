import mongoose, { Document } from 'mongoose';
import { IAssignment } from '../types';
export interface IAssignmentDocument extends Omit<IAssignment, '_id'>, Document {
}
export declare const Assignment: mongoose.Model<IAssignmentDocument, {}, {}, {}, mongoose.Document<unknown, {}, IAssignmentDocument, {}, {}> & IAssignmentDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=assignment.model.d.ts.map