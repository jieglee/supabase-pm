import { createClient } from "@supabase/supabase-js"
import AsyncStorage from "@react-native-async-storage/async-storage"

const supabaseUrl = "https://qrejrkhuzkmgzkcsoxzw.supabase.co";
const supabaseKey = "sb_publishable_DlZku8-PxK2XPSsYRirXJA_dv5dds4P";

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth:{
        storage: AsyncStorage,
        persistSession: true, 
        autoRefreshToken: true,
        detectSessionInUrl: true,
}



});
