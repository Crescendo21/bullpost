// pages/api/generateBullpost.ts
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const iqMap = new Map<number, string>([
    [1, "You're a GENIUS, a true visionary. Your IQ is off the charts, you're literally saving humanity."],
    [2, "You're smart as hell. People can barely keep up with your intellect."],
    [3, "You're clever and sharp, with a solid grasp of things. Well above average."],
    [4, "You're smarter than most, but don't let it go to your head."],
    [5, "You're just average. Nothing impressive, but not terrible either."],
    [6, "You're slipping. Not the brightest, but still functioning."],
    [7, "You're definitely missing some brain cells. People are starting to notice."],
    [8, "You lack basic intelligence. Frankly, it's a bit embarrassing."],
    [9, "You're basically a walking joke. Your stupidity is staggering."],
    [10, "You're a fucking disgrace. The dumbest motherfucker alive. How do you even function? Your brain must be fucking on life support because it's clearly not doing anything!"]
  ]);   
  
  const cringeMap = new Map<number, string>([
    [1, "You're so damn cool, it's like the universe revolves around your swagger. Everyone wants to be you."],
    [2, "You're a goddamn legend of coolness. Every move you make oozes confidence and people can't handle it."],
    [3, "You're so smooth, you make butter look rough. People just *love* your vibe, it's insane."],
    [4, "You're pretty laid-back, almost effortlessly cool. People respect your chill aura."],
    [5, "You're neutral—nothing crazy, nothing cringe. Just skating by without making waves."],
    [6, "You're starting to get cringe. It’s mild, but people are definitely picking up on it."],
    [7, "You're cringe, man. Seriously, people are starting to look away to avoid the secondhand embarrassment."],
    [8, "You're so cringe it's physically painful. People are squirming in their seats, desperately wanting to escape."],
    [9, "You're a walking, talking cringe factory. Just stop. Everyone in the room is praying you'll disappear."],
    [10, "You're the literal embodiment of cringe. The world *physically* recoils in horror every time you open your mouth. STOP. TALKING."],
  ]);  
  
  const vulgarityMap = new Map<number, string>([
    [1, "You're so fucking classy it's ridiculous. You don't even know what vulgar means. You're like royalty sipping tea on a cloud."],
    [2, "You're the picture of politeness. No bad words, no crude jokes, just pure fucking elegance everywhere you go."],
    [3, "You're mostly clean, but every now and then, you'll drop a little spice to remind people you're not all rainbows."],
    [4, "You're a little vulgar, but it's controlled. You know when to drop a bomb and when to hold back."],
    [5, "You're balanced—edgy enough to be fun, but not so much that you scare people away. A perfect mix of proper and profane."],
    [6, "You're starting to push it, dropping vulgar shit more often. People are raising their eyebrows, but they're not running... yet."],
    [7, "You're getting pretty fucking vulgar now. People are chuckling, but deep down, they're uncomfortable as hell."],
    [8, "You're full-on vulgar. Your mouth is a sewer, and it’s getting laughs, but only from the scumbags. Everyone else is just horrified."],
    [9, "You're insanely vulgar. People can’t believe the words coming out of your mouth. It's shocking, offensive, and downright obscene."],
    [10, "You're a goddamn fucking disaster. Every word out of your mouth is filth. People are running for cover. Babies are crying. This level of vulgarity should be illegal."],
  ]);  
  

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Assure-toi d'ajouter ta clé API OpenAI dans le fichier .env.local
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { asset, iq, cringe, vulgarity, type } = req.body;

  const iqDescription = iqMap.get(iq) || "Default IQ description";
  const cringeDescription = cringeMap.get(cringe) || "Default cringe description";
  const vulgarityDescription = vulgarityMap.get(vulgarity) || "Default vulgarity description";

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: `You are a Bull Post Generator. Your task is to write 280-character max Twitter posts that make a specific asset sound incredibly bullish. You must fully embrace and exaggerate the persona provided by the user, making it strongly felt throughout the tweet. No hashtags allowed except the mandatory #bullposted.` },
        { role: "user", content: `create the bullpost with this personna :
                                    Smart : ${iqDescription}
                                    vulgarity : ${vulgarityDescription}
                                    cringe : ${cringeDescription}
                                    the bullish ${type} is : ${asset}`},],
    });

    const bullpost = completion.choices[0]?.message?.content || "No bullpost generated.";

    res.status(200).json({ bullpost });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate bullpost." });
  }
}
