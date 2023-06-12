import { supabase } from "../../../supabase";
// @ts-ignore
import { cache } from "react";


export const getAllProposals = cache(async()=>supabase.from('Proposals').select('*'))