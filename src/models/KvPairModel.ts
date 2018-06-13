import * as mongoose from 'mongoose';

export interface KvPair {
  key: string;
  value: any;
}

const kvPairSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
});

export const KvPairModel = mongoose.model<KvPair & mongoose.Document>('KvPair', kvPairSchema);
