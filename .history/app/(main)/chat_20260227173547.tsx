import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext"; // Add this import
import { supabase } from "@/lib/supabase";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Types
interface Message {
  id: string;
  text: string;
  sender: "user" | "orient";
  timestamp: Date;
  read?: boolean;
  status?: "sending" | "sent" | "delivered";
  is_ai_response?: boolean;
}

interface SavedMessage {
  id?: string;
  user_id: string;
  user_message: string;
  ai_response?: string;
  is_ai_enabled: boolean;
  response_source: "ai" | "manual";
  created_at: Date;
}

type ChatStatus = "online" | "typing" | "offline";

// Configuration
const OPENROUTER_API_KEY =
  "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";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Phone number for calling
const SUPPORT_PHONE_NUMBER = "+966123456789"; // Replace with your actual number
const WHATSAPP_NUMBER = "+966123456789"; // Replace with your actual WhatsApp number

export default function ChatScreen() {
  const { user } = useAuth();
  const { colors, isDarkMode } = useTheme(); // Add this line

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "مرحباً بك في Orient Team! نحن فريق الخبراء القانونيين الرائد في تقديم الحلول القانونية المتكاملة.",
      sender: "orient",
      timestamp: new Date(Date.now() - 300000),
      read: true,
      is_ai_response: false,
    },
    {
      id: "2",
      text: "يمكنني مساعدتك في:\n\n• مراجعة العقود والاتفاقيات القانونية\n• تقديم استشارات قانونية متخصصة\n• شرح الإجراءات والأنظمة السعودية\n• تحليل المستندات والمراكز القانونية\n• توجيهك للجهات المختصة\n\nكيف يمكنني مساعدتك اليوم؟",
      sender: "orient",
      timestamp: new Date(Date.now() - 290000),
      read: true,
      is_ai_response: false,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatStatus, setChatStatus] = useState<ChatStatus>("online");
  const [isAIEnabled, setIsAIEnabled] = useState(true);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [showCallOptions, setShowCallOptions] = useState(false);

  const suggestedQuestions = [
    { id: 1, text: "مراجعة عقد عمل جديد", category: "عقود" },
    { id: 2, text: "حقوق المستأجر في القانون السعودي", category: "قانوني" },
    { id: 3, text: "خطوات رفع دعوى تعويض", category: "قضائي" },
    { id: 4, text: "متطلبات عقد الزواج", category: "أحوال" },
    { id: 5, text: "تأسيس شركة جديدة", category: "تجاري" },
    { id: 6, text: "إنهاء عقد عمل", category: "عمل" },
    { id: 7, text: "استشارة في قضية مدنية", category: "قضائي" },
    { id: 8, text: "مراجعة عقد بيع عقار", category: "عقاري" },
    { id: 9, text: "مشكلة في عقد", category: "عقود" },
    { id: 10, text: "قضية في المحكمة", category: "قضائي" },
    { id: 11, text: "استشارة قانونية عاجلة", category: "قانوني" },
    { id: 12, text: "مشكلة مع صاحب العمل", category: "عمل" },
  ];

  // Save chat to database when NOT in AI mode
  const saveChatToDatabase = async (
    userMessage: string,
    aiResponse?: string,
  ) => {
    if (!user || isAIEnabled) {
      console.log("💾 Skipping database save - AI mode enabled or no user");
      return;
    }

    try {
      console.log("💾 Saving chat to database...");

      const chatData: SavedMessage = {
        user_id: user.id,
        user_message: userMessage,
        ai_response: aiResponse,
        is_ai_enabled: false,
        response_source: "manual",
        created_at: new Date(),
      };

      const { data, error } = await supabase
        .from("user_chats")
        .insert([chatData])
        .select();

      if (error) {
        console.error("❌ Error saving chat to database:", error);

        const { error: altError } = await supabase
          .from("chats")
          .insert([chatData])
          .select();

        if (altError) {
          console.error("❌ Alternative table also failed:", altError);
          return;
        }
      }

      console.log("✅ Chat saved to database:", data?.[0]?.id);
    } catch (error) {
      console.error("❌ Error in saveChatToDatabase:", error);
    }
  };

  // Get AI response function
  const getAIResponse = async (userQuestion: string): Promise<string> => {
    if (!isAIEnabled) {
      const response = getExactResponse(userQuestion);
      await saveChatToDatabase(userQuestion, response);
      return response;
    }

    try {
      if (
        !OPENROUTER_API_KEY ||
        OPENROUTER_API_KEY.includes(
          "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",
        )
      ) {
        console.log("Using local responses (API key not configured)");
        const response = getExactResponse(userQuestion);
        return response;
      }

      console.log("Sending request to OpenRouter API...");

      const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://orient-team.com",
          "X-Title": "Orient Legal Assistant",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528:free", // Microsoft model,
          messages: [
            {
              role: "system",
              content: `أنت مساعد قانوني متخصص في القانون السعودي. اسمك Orient Team.
قدم استشارات قانونية دقيقة وواضحة باللغة العربية.
كن مفيداً، احترافياً، ودوداً.
ركز على تقديم معلومات عملية يمكن تطبيقها.
استخدم لغة عربية فصحى واضحة.`,
            },
            {
              role: "user",
              content: userQuestion,
            },
          ],
          max_tokens: 800,
          temperature: 0.7,
        }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenRouter API Error Response:", errorText);
        const localResponse = getExactResponse(userQuestion);
        return localResponse;
      }

      const data = await response.json();

      let aiResponse = "";

      if (data.choices && data.choices[0]?.message?.content) {
        aiResponse = data.choices[0].message.content;
      } else if (data.choices && data.choices[0]?.text) {
        aiResponse = data.choices[0].text;
      } else if (data.generated_text) {
        aiResponse = data.generated_text;
      } else if (data.response) {
        aiResponse = data.response;
      } else if (data.result) {
        aiResponse = data.result;
      } else if (data.output) {
        aiResponse = data.output;
      } else {
        console.log("No standard response format found");
        return getExactResponse(userQuestion);
      }

      aiResponse = cleanAIResponse(aiResponse);

      if (aiResponse.trim().length < 30) {
        return getExactResponse(userQuestion);
      }

      return aiResponse;
    } catch (error: any) {
      console.error("AI Response Error:", error.message);
      return getExactResponse(userQuestion);
    }
  };

  // Clean AI response
  const cleanAIResponse = (response: string): string => {
    if (!response) return "";

    let cleaned = response;

    const patterns = [
      /<s>/g,
      /<\/s>/g,
      /###/g,
      /\*\*\*/g,
      /Assistant:\s*/gi,
      /النموذج:\s*/gi,
      /المساعد:\s*/gi,
      /User:\s*/gi,
      /المستخدم:\s*/gi,
      /^[\s\S]*?(?=مرحباً|أهلاً|بسم الله|السلام عليكم|تحية|شكراً)/i,
      /\[INST\].*?\[\/INST\]/gs,
    ];

    patterns.forEach((pattern) => {
      cleaned = cleaned.replace(pattern, "");
    });

    cleaned = cleaned
      .replace(/\n\s*\n\s*\n/g, "\n\n")
      .replace(/^\s+|\s+$/g, "")
      .trim();

    return cleaned;
  };

  // Send message function
  const sendMessage = async () => {
    if (!inputText.trim() || isLoadingAI) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
      status: "sending",
      is_ai_response: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);
    setChatStatus("typing");

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: "sent" } : msg,
        ),
      );
    }, 300);

    try {
      const responseText = await getAIResponse(inputText);

      const orientResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: "orient",
        timestamp: new Date(),
        is_ai_response: isAIEnabled,
      };

      setMessages((prev) => [...prev, orientResponse]);

      if (!isAIEnabled && user) {
        await saveChatToDatabase(inputText, responseText);
      }
    } catch (error: any) {
      console.error("Send message error:", error.message);

      const fallbackResponse: Message = {
        id: (Date.now() + 2).toString(),
        text: getExactResponse(inputText),
        sender: "orient",
        timestamp: new Date(),
        is_ai_response: false,
      };

      setMessages((prev) => [...prev, fallbackResponse]);

      if (!isAIEnabled && user) {
        await saveChatToDatabase(inputText, fallbackResponse.text);
      }
    } finally {
      setIsTyping(false);
      setChatStatus("online");

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id
            ? { ...msg, status: "delivered", read: true }
            : msg,
        ),
      );
    }
  };

  // Exact response function (manual responses)
  const getExactResponse = (userQuestion: string): string => {
    const question = userQuestion.toLowerCase().trim();

    const normalizedQuestion = question
      .replace(/[،.,!,؟,?]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const questionWords = normalizedQuestion.split(" ");

    const keywordPatterns = {
      employmentContract: {
        keywords: [
          "عقد عمل",
          "عقد توظيف",
          "توظيف",
          "عمل",
          "موظف",
          "متعاقد",
          "مستخدم",
        ],
        synonyms: ["توظيف", "وظيفة", "شغل", "خدمة", "موظفين", "عمالة"],
        responseIndex: 0,
      },
      tenantRights: {
        keywords: [
          "حقوق مستأجر",
          "مستأجر",
          "إيجار",
          "عقد إيجار",
          "إيجار عقار",
          "مؤجر",
          "عقار مؤجر",
        ],
        synonyms: [
          "مستأجرين",
          "مكتري",
          "إيجارات",
          "كري",
          "عقارات مؤجرة",
          "شقة مؤجرة",
        ],
        responseIndex: 1,
      },
      lawsuitProcedures: {
        keywords: [
          "دعوى تعويض",
          "رفع دعوى",
          "قضية",
          "محكمة",
          "نزاع",
          "شكوى قضائية",
          "مقاضاة",
          "دعوى قضائية",
        ],
        synonyms: [
          "مقاضاة",
          "تظلم",
          "شكوى",
          "نزاع قضائي",
          "دعاوي",
          "محاكم",
          "قضايا",
        ],
        responseIndex: 2,
      },
      marriageContracts: {
        keywords: [
          "عقد زواج",
          "زواج",
          "مهر",
          "نكاح",
          "عقد النكاح",
          "زواج شرعي",
          "كتاب زواج",
        ],
        synonyms: [
          "زواجي",
          "متزوج",
          "عقد قران",
          "مهرية",
          "عقد زواجي",
          "زواج جديد",
        ],
        responseIndex: 3,
      },
      companyEstablishment: {
        keywords: [
          "تأسيس شركة",
          "شركة جديدة",
          "سجل تجاري",
          "مؤسسة",
          "استثمار",
          "تأسيس عمل",
          "شركة ناشئة",
        ],
        synonyms: [
          "تأسيس أعمال",
          "إنشاء شركة",
          "بداية شركة",
          "عمل جديد",
          "مشروع تجاري",
          "سجل تجاري جديد",
        ],
        responseIndex: 4,
      },
      contractTermination: {
        keywords: [
          "إنهاء عقد عمل",
          "فصل",
          "استقالة",
          "انهاء خدمة",
          "طرد",
          "إنهاء عقد",
          "فسخ عقد",
          "إقالة",
        ],
        synonyms: [
          "إنهاء خدمات",
          "تسريح",
          "إنهاء تعاقد",
          "فصل من العمل",
          "ترك العمل",
          "استقال",
        ],
        responseIndex: 5,
      },
    };

    const calculateMatchScore = (pattern: any): number => {
      let score = 0;

      pattern.keywords.forEach((keyword: string) => {
        if (normalizedQuestion.includes(keyword)) {
          score += 10;
        }
      });

      pattern.keywords.forEach((keyword: string) => {
        const keywordParts = keyword.split(" ");
        keywordParts.forEach((part: string) => {
          if (part.length > 2 && normalizedQuestion.includes(part)) {
            score += 5;
          }
        });
      });

      pattern.synonyms.forEach((synonym: string) => {
        if (normalizedQuestion.includes(synonym)) {
          score += 3;
        }
      });

      pattern.keywords.forEach((keyword: string) => {
        const keywordWords = keyword.split(" ");
        const matchedWords = keywordWords.filter((word) =>
          questionWords.some(
            (qWord) => qWord.includes(word) || word.includes(qWord),
          ),
        );
        if (matchedWords.length > 0) {
          score += matchedWords.length * 2;
        }
      });

      if (score > 0) {
        score += Math.min(normalizedQuestion.length / 10, 5);
      }

      return score;
    };

    const patternScores = Object.entries(keywordPatterns).map(
      ([key, pattern]) => ({
        key,
        pattern,
        score: calculateMatchScore(pattern),
      }),
    );

    patternScores.sort((a, b) => b.score - a.score);

    const bestMatch = patternScores[0];

    if (bestMatch.score >= 5) {
      return getDetailedResponseByIndex(
        bestMatch.pattern.responseIndex,
        userQuestion,
      );
    }

    const response = getDetailedResponseByIndex(
      bestMatch.score >= 5 ? bestMatch.pattern.responseIndex : 6,
      userQuestion,
    );
    return response.replace(/\*\*\*/g, "**");
  };

  const getDetailedResponseByIndex = (
    index: number,
    originalQuestion?: string,
  ): string => {
    const responses = [
      `📋 **مراجعة عقد العمل - تحليل قانوني متكامل**

**🔹 البنود الأساسية الواجب توافرها:**
1. **بيانات الأطراف**: الاسم الكامل، الجنسية، رقم الهوية/الإقامة
2. **مدة العقد**: تحديد المدة (محددة/غير محددة) مع تاريخ البدء والانتهاء
3. **المسمى الوظيفي**: وصف دقيق للمهام والمسؤوليات
4. **مكان العمل**: تحديد المقر الرئيسي وأي أماكن عمل أخرى
5. **ساعات العمل**: عدد الساعات اليومية والأسبوعية وفق نظام العمل
6. **الراتب والمزايا**: 
   - الراتب الأساسي الشهري
   - البدلات (سكن، مواصلات، معيشة)
   - تاريخ صرف الراتب
   - آلية الزيادة السنوية

**🔹 نقاط قانونية هامة:**
• **فترة التجربة**: لا تتجاوز 90 يومًا قابلة للتجديد مرة واحدة
• **الإجازات**: 
  - إجازة سنوية 30 يومًا بعد السنة الأولى
  - إجازات رسمية مدفوعة الأجر
  - إجازة مرضية وفق اللوائح
• **مكافأة نهاية الخدمة**: 
  - نصف شهر راتب عن كل سنة من السنوات الخمس الأولى
  - شهر راتب كامل عن كل سنة بعد ذلك

**هل لديك عقد محدد تود مراجعته؟ يمكنني تحليل بنوده بالتفصيل.**`,
      `🏠 **حقوق المستأجر في النظام السعودي - الحماية القانونية الكاملة**

**🔹 حقوق المستأجر الأساسية:**
1. **التمتع بالعقار**: الحق في استخدام العقار للسكنى أو النشاط المتفق عليه
2. **الصيانة والسلامة**: 
   - يتحمل المالك تكاليف الصيانة الأساسية
   - التأمين على العين المؤجرة
   - صلاحية المرافق والخدمات
3. **الخصوصية والأمان**: 
   - لا يجوز للمالك الدخول بدون إذن مسبق
   - استثناء: حالات الطوارئ والضرورة القصوى
4. **ثبات الشروط**: 
   - لا تزيد قيمة الإيجار خلال مدة العقد
   - الشروط المتفق عليها تظل سارية

**هل تواجه مشكلة إيجارية محددة؟ أرشدك للخطوات القانونية الصحيحة.**`,
      `⚖️ **رفع دعوى تعويض - الدليل القانوني الشامل**

**🔹 الخطوات الإجرائية الدقيقة:**

**المرحلة الأولى: الإعداد والتجهيز**
1. **تحديد نوع النزاع**: 
   - مدني، تجاري، عمالي، إداري
   - تحديد القيمة المالية للتعويض
2. **جمع الأدلة**: 
   - المستندات والعقود الموقعة
   - المراسلات (البريد، واتساب، رسائل نصية)
   - الشهادات والصور والفيديوهات
   - تقارير الخبراء والمعاينات

**المرحلة الثانية: صياغة العريضة**
• **بيانات الخصوم**: الأسماء الكاملة، الجنسيات، عناوين الإقامة
• **الوقائع**: سرد زمني للأحداث بدقة ووضوح
• **الطلبات**: 
  - التعويض المادي عن الأضرار
  - التعويض المعنوي إذا وجد
  - المصاريف القضائية والمحاماة

**هل يمكنك تحديد طبيعة النزاع والقيمة التقريبية للتعويض المطلوب؟**`,
      `💍 **عقد الزواج - المتطلبات والشروط الشرعية**

**🔹 المستندات المطلوبة رسميًا:**
1. **الهوية الوطنية**: أصل الهوية للطرفين
2. **شهادة الميلاد**: حديثة ومصدقة
3. **صور شخصية**: مقاس 4×6 بخلفية بيضاء
4. **الفحص الطبي**: شهادة الفحص ما قبل الزواج
5. **موافقة ولي الأمر**: للقاصرات دون 25 سنة
6. **إقرارات قانونية**: 
   - إقرار بعدم وجود موانع شرعية
   - إقربان الحالة الاجتماعية

**🔹 بنود عقد الزواج الأساسية:**
• **المهر**: 
  - المقدم (الدفعة الأولى)
  - المؤخر (المؤجل عند الطلاق أو الوفاة)
  - تحديد القيمة كتابيًا
• **النفقة**: 
  - النفقة الشهرية للمرأة
  - نفقة الأولاد
• **السكن**: تحديد مسكن الزوجية

**هل تحتاج إلى مراجعة عقد زواج محدد أو استفسار عن بنود معينة؟**`,
      `🏢 **تأسيس الشركات - الإجراءات النظامية الكاملة**

**🔹 أنواع الشركات في السعودية:**

**1. شركة ذات مسؤولية محدود (ذ.م.م):**
• الحد الأدنى للشركاء: شريك واحد
• رأس المال: 500,000 ريال (مستثنى للأنشطة المهنية)
• المسؤولية: محدودة بمقدار حصة الشريك

**🔹 خطوات التأسيس الفعلية:**

**المرحلة الأولى: التخطيط**
1. اختيار النشاط (من 1500 نشاط معتمد)
2. تحديد الشكل القانوني المناسب
3. اختيار الاسم التجاري (فحص عبر منصة "سبه")
4. تحديد رأس المال والمقار

**ما هو النشاط الذي تخطط له وميزانيتك التقريبية؟**`,
      `📄 **إنهاء عقد العمل - الحقوق والمستحقات القانونية**

**🔹 أنواع إنهاء عقد العمل:**

**1. الاستقالة الطوعية:**
• **الإشعار المسبق**: 
  - 60 يومًا للعامل غير السعودي
  - 30 يومًا للعامل السعودي
• **المستحقات**: 
  - الراتب حتى آخر يوم عمل
  - الإجازات المستحقة
  - مكافأة نهاية الخدمة كاملة

**2. الفصل لأسباب مشروعة:**
• **التقصير الجسيم**: 
  - الغش، السرقة، الإهمال المتكرر
  - التسبب في أضرار جسيمة للشركة

**3. الفصل التعسفي:**
• **التعويضات**: 
  - مكافأة نهاية الخدمة كاملة
  - تعويض إضافي يعادل 15 يوم راتب عن كل سنة
  - جميع المستحقات المالية

**هل يمكنك توضيح سبب إنهاء العقد والمدة التي قضيتها في العمل؟**`,
      `🌟 **فريق Orient Team القانوني - خدمتك الشاملة**

شكراً لسؤالك: "${originalQuestion}"

**🔹 خدماتنا الرئيسية:**

**1. الاستشارات القانونية:**
• تحليل المركز القانوني
• تقديم الآراء القانونية
• دراسة النزاعات والحلول

**2. صياغة العقود:**
• صياغة العقود والاتفاقيات
• مراجعة العقود المعدة
• التفاوض نيابة عنك

**3. التمثيل القانوني:**
• التمثيل أمام المحاكم
• التمثيل أمام الجهات الحكومية
• التمثيل في التحكيم والوساطة

**🔹 للاستفادة المثلى من خدماتنا، يرجى توضيح:**
1. طبيعة الاستفسار أو القضية
2. الوثائق والمستندات المتاحة
3. الإطار الزمني المطلوب
4. النتيجة المرجوة

**فريقنا المختص سيقوم بدراسة حالتك وإعداد الحلول المناسبة.**

**نحن في Orient Team نؤمن بأن الحل القانوني الصحيح هو بداية النجاح.**`,
    ];

    return responses[Math.min(index, responses.length - 1)];
  };

  const parseTextWithFormatting = (text: string) => {
    const parts = [];
    let currentText = "";
    let isBold = false;

    for (let i = 0; i < text.length; i++) {
      if (
        text.substring(i, i + 2) === "**" &&
        (i === 0 || text[i - 1] !== "\\")
      ) {
        if (currentText) {
          parts.push({ text: currentText, bold: isBold });
          currentText = "";
        }
        isBold = !isBold;
        i++;
      } else {
        currentText += text[i];
      }
    }

    if (currentText) {
      parts.push({ text: currentText, bold: isBold });
    }

    return parts;
  };

  const toggleAI = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newAIState = !isAIEnabled;
    setIsAIEnabled(newAIState);
    Alert.alert(
      "وضع المساعد",
      `تم ${newAIState ? "تفعيل" : "تعطيل"} الذكاء الاصطناعي\n\n${newAIState ? "⚠️ تم تعطيل حفظ المحادثات في قاعدة البيانات" : "✅ سيتم حفظ جميع المحادثات في قاعدة البيانات"}`,
      [{ text: "حسناً" }],
    );
  };

  const makePhoneCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowCallOptions(false);

    Alert.alert(
      "الاتصال بفريق Orient Team",
      `هل تريد الاتصال بالرقم:\n${SUPPORT_PHONE_NUMBER}`,
      [
        { text: "إلغاء", style: "cancel" },
        {
          text: "اتصال",
          onPress: () => {
            Linking.openURL(`tel:${SUPPORT_PHONE_NUMBER}`).catch((err) => {
              Alert.alert("خطأ", "تعذر فتح تطبيق الهاتف");
              console.error("Error opening phone:", err);
            });
          },
        },
      ],
    );
  };

  const openWhatsApp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowCallOptions(false);

    const message = "مرحباً، أريد الاستفسار عن خدمات Orient Team القانونية";
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    Linking.openURL(url).catch((err) => {
      Alert.alert("خطأ", "تعذر فتح تطبيق WhatsApp");
      console.error("Error opening WhatsApp:", err);
    });
  };

  const showCallMenu = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowCallOptions(!showCallOptions);
  };

  const renderCallOptions = () => {
    if (!showCallOptions) return null;

    return (
      <View
        style={[
          styles.callOptionsContainer,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.callOption, { borderBottomColor: colors.border }]}
          onPress={makePhoneCall}
        >
          <View
            style={[styles.callOptionIcon, { backgroundColor: colors.success }]}
          >
            <Ionicons name="call" size={18} color={colors.textInverse} />
          </View>
          <View style={styles.callOptionText}>
            <Text
              style={[styles.callOptionTitle, { color: colors.textPrimary }]}
            >
              اتصال هاتفي
            </Text>
            <Text
              style={[styles.callOptionNumber, { color: colors.textSecondary }]}
            >
              {SUPPORT_PHONE_NUMBER}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.callOption, { borderBottomColor: colors.border }]}
          onPress={openWhatsApp}
        >
          <View
            style={[styles.callOptionIcon, { backgroundColor: colors.success }]}
          >
            <Ionicons
              name="logo-whatsapp"
              size={18}
              color={colors.textInverse}
            />
          </View>
          <View style={styles.callOptionText}>
            <Text
              style={[styles.callOptionTitle, { color: colors.textPrimary }]}
            >
              واتساب
            </Text>
            <Text
              style={[styles.callOptionNumber, { color: colors.textSecondary }]}
            >
              {WHATSAPP_NUMBER}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.callOption}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setShowCallOptions(false);
          }}
        >
          <View
            style={[
              styles.callOptionIcon,
              { backgroundColor: colors.textSecondary },
            ]}
          >
            <Ionicons name="close" size={20} color={colors.textInverse} />
          </View>
          <Text style={[styles.callOptionTitle, { color: colors.textPrimary }]}>
            إغلاق
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderMessageStatus = (status?: string) => {
    switch (status) {
      case "sending":
        return <ActivityIndicator size="small" color={colors.textSecondary} />;
      case "sent":
        return (
          <Ionicons name="checkmark" size={14} color={colors.textSecondary} />
        );
      case "delivered":
        return (
          <Ionicons name="checkmark-done" size={14} color={colors.primary} />
        );
      default:
        return null;
    }
  };

  const renderMessage = (message: Message) => {
    const textParts = parseTextWithFormatting(message.text);

    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          message.sender === "user" ? styles.userMessage : styles.orientMessage,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            message.sender === "user" ? styles.userBubble : styles.orientBubble,
            message.sender === "user"
              ? { backgroundColor: colors.primary }
              : { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text
            style={[
              styles.messageText,
              message.sender === "user" && styles.userMessageText,
              message.sender === "user"
                ? { color: colors.textInverse }
                : { color: colors.textPrimary },
            ]}
          >
            {textParts.map((part, index) => (
              <Text key={index} style={part.bold ? styles.boldText : {}}>
                {part.text}
              </Text>
            ))}
          </Text>

          <View style={styles.messageFooter}>
            <Text
              style={[
                styles.messageTime,
                message.sender === "user" && styles.userMessageTime,
                message.sender === "user"
                  ? { color: colors.textInverse + "80" }
                  : { color: colors.textSecondary },
              ]}
            >
              {message.timestamp.toLocaleTimeString("ar-SA", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>

            {message.sender === "orient" && (
              <View
                style={[styles.aiBadge, { backgroundColor: colors.elevated }]}
              >
                <Text style={[styles.aiBadgeText, { color: colors.primary }]}>
                  {message.is_ai_response ? "🤖 AI" : "👨‍💼 فريق"}
                </Text>
              </View>
            )}

            {message.sender === "user" && (
              <View style={styles.messageStatus}>
                {renderMessageStatus(message.status)}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.card,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      shadowColor: colors.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 8,
      zIndex: 10,
    },
    headerBackground: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "100%",
      backgroundColor: colors.card,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    headerContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: Platform.OS === "ios" ? 20 : 40,
      paddingBottom: 12,
      paddingHorizontal: 20,
    },
    headerLeft: {
      flex: 1,
    },
    orientHeader: {
      flexDirection: "row",
      alignItems: "center",
    },
    logoContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    brandTextContainer: {
      flexDirection: "column",
    },
    orientWord: {
      flexDirection: "row",
      direction: "ltr",
    },
    orientLetter: {
      fontSize: 18,
      fontWeight: "800",
      marginHorizontal: 0.5,
      letterSpacing: 0.2,
      color: colors.primary,
    },
    teamText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.primary,
      marginTop: 1,
      letterSpacing: 0.5,
    },
    statusBar: {
      backgroundColor: colors.background,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    statusContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    statusIndicator: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.elevated,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 8,
    },
    statusOnline: {
      backgroundColor: colors.success + "40",
    },
    statusPulse: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.success,
    },
    statusText: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.elevated,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 8,
    },
    messagesContainer: {
      flex: 1,
    },
    messagesContent: {
      padding: 16,
      paddingBottom: 8,
    },
    messageContainer: {
      marginBottom: 12,
    },
    userMessage: {
      alignItems: "flex-end",
    },
    orientMessage: {
      alignItems: "flex-start",
    },
    messageBubble: {
      maxWidth: SCREEN_WIDTH * 0.85,
      padding: 16,
      borderRadius: 18,
      shadowColor: colors.shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    userBubble: {
      borderBottomRightRadius: 4,
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
    },
    orientBubble: {
      borderBottomLeftRadius: 4,
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      borderWidth: 1,
    },
    messageText: {
      fontSize: 15,
      lineHeight: 24,
    },
    boldText: {
      fontWeight: "700",
    },
    userMessageText: {
      color: colors.textInverse,
    },
    messageFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 8,
    },
    messageTime: {
      fontSize: 11,
      fontWeight: "500",
    },
    userMessageTime: {
      color: colors.textInverse + "80",
    },
    aiBadge: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
      marginLeft: 8,
    },
    aiBadgeText: {
      fontSize: 10,
      fontWeight: "600",
    },
    messageStatus: {
      marginLeft: 6,
    },
    typingContainer: {
      flexDirection: "column",
      minWidth: 60,
      alignItems: "flex-start",
      marginBottom: 4,
    },
    orientTypingHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    typingText: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: "600",
      marginLeft: 4,
    },
    typingIndicator: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
    },
    typingDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.textSecondary,
      marginHorizontal: 2,
    },
    typingDot1: {
      opacity: 0.3,
    },
    typingDot2: {
      opacity: 0.6,
    },
    typingDot3: {
      opacity: 0.9,
    },
    suggestionsSection: {
      marginBottom: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    suggestionsHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    suggestionsTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    aiIndicator: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    aiIndicatorText: {
      fontSize: 11,
      color: colors.textSecondary,
      marginLeft: 4,
      fontWeight: "600",
    },
    aiIndicatorActive: {
      color: colors.success,
    },
    aiIndicatorInactive: {
      color: colors.primary,
    },
    suggestionsContainer: {
      flexDirection: "row",
      overflow: "visible",
      paddingBottom: 4,
      marginLeft: -16,
      marginRight: -16,
    },
    suggestionsContent: {
      paddingRight: 16,
    },
    suggestionButton: {
      backgroundColor: colors.card,
      padding: 12,
      borderRadius: 12,
      marginRight: 12,
      borderWidth: 0.5,
      borderColor: colors.border,
      minWidth: 140,
      shadowColor: colors.shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 2,
      elevation: 2,
      justifyContent: "center",
    },
    suggestionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
    },
    suggestionCategory: {
      fontSize: 11,
      color: colors.primary,
      fontWeight: "600",
      backgroundColor: colors.elevated,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
    },
    suggestionText: {
      fontSize: 13,
      fontWeight: "500",
      color: colors.textPrimary,
      lineHeight: 20,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      shadowColor: colors.shadowColor,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 10,
    },
    inputWrapper: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background,
      borderRadius: 24,
      paddingHorizontal: 8,
      paddingVertical: 6,
      marginRight: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    actionButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
    },
    clearButton: {
      width: 30,
      height: 30,
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 4,
    },
    textInput: {
      flex: 1,
      fontSize: 15,
      color: colors.textPrimary,
      paddingHorizontal: 12,
      maxHeight: 120,
      minHeight: 36,
      textAlignVertical: "top",
    },
    sendButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 4,
    },
    sendButtonDisabled: {
      backgroundColor: colors.elevated,
      shadowOpacity: 0,
    },
    callOptionsContainer: {
      position: "absolute",
      top: 90,
      right: 20,
      borderRadius: 8,
      borderWidth: 1,
      shadowColor: colors.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.5 : 0.2,
      shadowRadius: 8,
      elevation: 10,
      zIndex: 100,
      minWidth: 150,
    },
    callOption: {
      flexDirection: "row",
      alignItems: "center",
      padding: 8,
      borderBottomWidth: 1,
    },
    callOptionIcon: {
      width: 26,
      height: 26,
      borderRadius: 13,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 8,
    },
    callOptionText: {
      flex: 1,
    },
    callOptionTitle: {
      fontSize: 13,
      fontWeight: "600",
    },
    callOptionNumber: {
      fontSize: 11,
      marginTop: 2,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={colors.card}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerBackground} />
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View style={styles.orientHeader}>
                <View style={styles.logoContainer}>
                  <MaterialCommunityIcons
                    name="scale-balance"
                    size={24}
                    color={colors.textInverse}
                  />
                </View>

                <View style={styles.brandTextContainer}>
                  <View style={styles.orientWord}>
                    <Text
                      style={[styles.orientLetter, { color: colors.primary }]}
                    >
                      O
                    </Text>
                    <Text
                      style={[styles.orientLetter, { color: colors.primary }]}
                    >
                      R
                    </Text>
                    <Text
                      style={[styles.orientLetter, { color: colors.primary }]}
                    >
                      I
                    </Text>
                    <Text
                      style={[styles.orientLetter, { color: colors.primary }]}
                    >
                      E
                    </Text>
                    <Text
                      style={[styles.orientLetter, { color: colors.primary }]}
                    >
                      N
                    </Text>
                    <Text
                      style={[styles.orientLetter, { color: colors.primary }]}
                    >
                      T
                    </Text>
                  </View>
                  <Text style={styles.teamText}>
                    Team {isAIEnabled ? "🤖" : "💾"}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerButton} onPress={toggleAI}>
                <MaterialCommunityIcons
                  name={isAIEnabled ? "robot" : "database"}
                  size={22}
                  color={isAIEnabled ? colors.success : colors.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={showCallMenu}
              >
                <Ionicons
                  name="call-outline"
                  size={22}
                  color={colors.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <MaterialCommunityIcons
                  name="account-circle-outline"
                  size={24}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Status Bar */}
        <View style={styles.statusBar}>
          <View style={styles.statusContent}>
            <View
              style={[
                styles.statusIndicator,
                chatStatus === "online" && styles.statusOnline,
              ]}
            >
              <View style={styles.statusPulse} />
            </View>
            <Text style={styles.statusText}>
              {chatStatus === "typing"
                ? isLoadingAI
                  ? "جاري تحليل سؤالك بواسطة الذكاء الاصطناعي..."
                  : "يكتب فريق Orient Team..."
                : `فريق Orient Team ${isAIEnabled ? "(الذكاء الاصطناعي مفعل)" : "(الردود المحلية - يتم الحفظ)"}`}
            </Text>
          </View>
        </View>

        {/* Call Options Overlay */}
        {renderCallOptions()}

        {/* Chat Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            setTimeout(() => {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
          }}
        >
          {messages.map(renderMessage)}

          {isTyping && (
            <View style={[styles.messageContainer, styles.orientMessage]}>
              <View
                style={[
                  styles.messageBubble,
                  styles.orientBubble,
                  { backgroundColor: colors.card },
                ]}
              >
                <View style={styles.typingContainer}>
                  <View style={styles.orientTypingHeader}>
                    <MaterialCommunityIcons
                      name="scale-balance"
                      size={16}
                      color={colors.primary}
                    />
                    <Text style={styles.typingText}>
                      {isLoadingAI
                        ? "جاري تحليل بواسطة الذكاء الاصطناعي..."
                        : "يكتب فريق Orient Team..."}
                    </Text>
                  </View>
                  <View style={styles.typingIndicator}>
                    <View style={[styles.typingDot, styles.typingDot1]} />
                    <View style={[styles.typingDot, styles.typingDot2]} />
                    <View style={[styles.typingDot, styles.typingDot3]} />
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Suggested Questions */}
          {inputText === "" && (
            <View style={styles.suggestionsSection}>
              <View style={styles.suggestionsHeader}>
                <Text style={styles.suggestionsTitle}>اسأل عن:</Text>
                <View style={styles.aiIndicator}>
                  <MaterialCommunityIcons
                    name={isAIEnabled ? "robot-happy" : "database"}
                    size={16}
                    color={isAIEnabled ? colors.success : colors.primary}
                  />
                  <Text
                    style={[
                      styles.aiIndicatorText,
                      isAIEnabled
                        ? styles.aiIndicatorActive
                        : styles.aiIndicatorInactive,
                    ]}
                  >
                    {isAIEnabled
                      ? "الذكاء الاصطناعي مفعل"
                      : "الردود المحلية (يتم الحفظ)"}
                  </Text>
                </View>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.suggestionsContainer}
                contentContainerStyle={styles.suggestionsContent}
              >
                {suggestedQuestions.map((question) => (
                  <TouchableOpacity
                    key={question.id}
                    style={styles.suggestionButton}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setInputText(question.text);
                    }}
                  >
                    <View style={styles.suggestionHeader}>
                      <Text style={styles.suggestionCategory}>
                        {question.category}
                      </Text>
                      {isAIEnabled ? (
                        <MaterialCommunityIcons
                          name="robot"
                          size={12}
                          color={colors.success}
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name="database"
                          size={12}
                          color={colors.primary}
                        />
                      )}
                    </View>
                    <Text style={styles.suggestionText}>{question.text}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </ScrollView>

        {/* Input Container */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              }
            >
              <MaterialCommunityIcons
                name="microphone"
                size={22}
                color={colors.primary}
              />
            </TouchableOpacity>

            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder={
                isAIEnabled
                  ? "اكتب سؤالك القانوني هنا (الذكاء الاصطناعي مفعل)..."
                  : "اكتب سؤالك القانوني هنا (سيتم حفظ المحادثة)..."
              }
              placeholderTextColor={colors.textTertiary}
              multiline
              maxLength={500}
              textAlignVertical="top"
            />

            {inputText.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setInputText("")}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              }
            >
              <MaterialCommunityIcons
                name="paperclip"
                size={22}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isLoadingAI) && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoadingAI}
          >
            {isLoadingAI ? (
              <ActivityIndicator color={colors.textInverse} size="small" />
            ) : (
              <MaterialCommunityIcons
                name={inputText.trim() ? "send" : "send-outline"}
                size={24}
                color={
                  inputText.trim() ? colors.textInverse : colors.textSecondary
                }
              />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
