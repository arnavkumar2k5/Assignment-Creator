import { Queue } from 'bullmq';
import { JobData } from '../types';
export declare const assignmentQueue: Queue<JobData, any, string>;
export declare const pdfQueue: Queue<JobData, any, string>;
export declare const addAssignmentJob: (assignmentId: string) => Promise<void>;
export declare const addPdfJob: (assignmentId: string) => Promise<void>;
//# sourceMappingURL=assignment.queue.d.ts.map