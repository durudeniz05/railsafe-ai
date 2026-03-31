import { supabase } from "@/integrations/supabase/client";

export type GeminiAnalyzeInput = {
  query: string;
};

export type GeminiAnalyzeResult = {
  text: string;
};

export async function analyzeEtcsErrorCode(
  input: GeminiAnalyzeInput
): Promise<GeminiAnalyzeResult> {
  const { data, error } = await supabase.functions.invoke("analyze-etcs", {
    body: { query: input.query },
  });

  if (error) {
    throw new Error(error.message || "AI analiz servisi ile bağlantı kurulamadı.");
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return { text: data.text };
}
