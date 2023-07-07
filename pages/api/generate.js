import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "懺悔を20文字以内で入力してください",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      temperature: 0.6,
      max_tokens: 1000
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `#命令書:
  入力文に対して適切な聖書の引用を200字以内でしてください
  
  #制約条件:
  ・文字数は400文字以内。
  ・重要なキーワードを取り残さない。
  ・聖書から書き出した内容を切り抜く。
  
  #入力文の例:入社時期がズレると言われ不安を感じています。

  #出力文の例:詩篇121篇にはこのようにあります。わたしは山にむかって目をあげる。わが助けは、どこから来るであろうか。わが助けは、天と地を造られた主から来る。主はあなたの足の動かされるのをゆるされない。あなたを守る者はまどろむことがない。見よ、イスラエルを守る者はまどろむこともなく、眠ることもない。主はあなたを守る者、主はあなたの右の手をおおう陰である。昼は太陽があなたを撃つことなく、夜は月があなたを撃つことはない。主はあなたを守って、すべての災を免れさせ、またあなたの命を守られる。主は今からとこしえに至るまで、あなたの出ると入るとを守られるであろう。
  
  #入力文の例:お金に困っています。来月の生活も危ういです。

  #出力文の例:マタイによる福音書6章33節にはこのようにあります。まず神の国と神の義とを求めなさい。そうすれば、これらのものは、すべて添えて与えられるであろう。だから、あすのことを思いわずらうな。あすのことは、あす自身が思いわずらうであろう。一日の苦労は、その日一日だけで十分である。
  
  #入力文の例:将来が不安です。

  #出力文の例:ペテロの第一の手紙5章7節にはこのようにあります。神はあなたがたをかえりみていて下さるのであるから、自分の思いわずらいを、いっさい神にゆだねるがよい。
  
  #入力文の例:うつ病で元気が出ないです。

  #出力文の例:詩篇34篇5節にはこのようにあります。主を仰ぎ見て、光を得よ
  
  #入力文の例:告白をしたいのですが勇気が出ません。

  #出力文の例:ヨハネによる福音書16章33節にはこのようにあります。「あなたがたは、この世ではなやみがある。しかし、勇気を出しなさい。わたしはすでに世に勝っている」。
  
  #入力文の例:孤独を感じています。

  #出力文の例:詩篇139篇1〜4節にはこのようにあります。主よ、あなたはわたしを探り、わたしを知りつくされました。あなたはわがすわるをも、立つをも知り、遠くからわが思いをわきまえられます。あなたはわが歩むをも、伏すをも探り出し、わがもろもろの道をことごとく知っておられます。わたしの舌に一言もないのに、主よ、あなたはことごとくそれを知られます。
  

#入力文: ${capitalizedAnimal}
#出力文:`;
}
