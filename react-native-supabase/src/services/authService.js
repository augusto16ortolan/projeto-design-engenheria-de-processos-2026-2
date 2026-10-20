import { getErrorMessage } from "../utils/error";
import { userFromSupabase } from "./supabaseMappers";
import { supabase } from "../../supabase/supabase";

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export async function login(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizeEmail(email),
      password,
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    if (!data.user) {
      return { success: false, message: "Não foi possível identificar sua conta." };
    }

    return { success: true, user: userFromSupabase(data.user) };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Não foi possível entrar agora."),
    };
  }
}

export async function register(name, email, password) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: normalizeEmail(email),
      password,
      options: {
        data: { name: name.trim() },
      },
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    if (!data.user) {
      return { success: false, message: "Não foi possível criar a conta agora." };
    }

    return {
      success: true,
      user: userFromSupabase(data.user),
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Não foi possível criar a conta agora."),
    };
  }
}

export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Não foi possível sair da conta agora."),
    };
  }
}
