"use client"
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import JumpingImage from "@/components/jumping-image"; // Assure-toi que le chemin soit correct
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReloadIcon } from "@radix-ui/react-icons";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function Home() {
  const [sliderIQ, setSliderIQ] = useState(5); // État pour IQ
  const [sliderCringe, setSliderCringe] = useState(5); // État pour Cringe
  const [sliderVulgar, setSliderVulgar] = useState(5); // État pour Vulgarité
  const [selectValue, setSelectValue] = useState<string | null>(null); // Stocke la valeur sélectionnée
  const [bullpost, setBullpost] = useState<string | null>(null); // Pour stocker la réponse générée
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const response = await fetch("/api/write-post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        asset: values.username,
        iq: sliderIQ,
        cringe: sliderCringe,
        vulgarity: sliderVulgar,
        type: selectValue,
      }),
    });

    const data = await response.json();
    setBullpost(data.bullpost);
    setIsLoading(false);
  }

  const handleTweetButtonClick = () => {
    const tweetText = encodeURIComponent(`${bullpost}`);
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(tweetUrl, '_blank');
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      {/* Jumping images in the background */}
      <div className="absolute top-0 left-0 w-full h-full">
        <JumpingImage />
      </div>
      
      {/* Card on top of the jumping images */}
      <Card className="w-[450px] bg-[#F4CE14] relative z-10 p-4 border-none rounded-sm">
        <CardHeader className="bg-background rounded-lg text-3xl text-left font-bold">
          <div className="flex flex-row">
            <div>
              <CardTitle className="text-white">Create your bullpost</CardTitle>
              <CardDescription className="mt-2">
                Please enter your public display name.
              </CardDescription>
            </div>
            <div className="ml-auto ml-10">
              <Image 
                src="/logo_rockets.png" 
                alt="Bullpost logo"
                width={38} 
                height={38}
              />
            </div>   
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormItem>
                <FormControl>
                  <Input placeholder="Your bullish asset" className="border-white bg-white text-black" {...form.register("username")} />
                </FormControl>
                <FormMessage />
              </FormItem>
              <FormItem>
                <FormControl>
                  <Select onValueChange={setSelectValue}> {/* Ajoute un onValueChange pour stocker la sélection */}
                    <SelectTrigger className="w-full border-white bg-white text-black/60">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="crypto">Crypto</SelectItem>
                        <SelectItem value="nft">NFT</SelectItem>
                        <SelectItem value="dapp">Dapp</SelectItem>
                        <SelectItem value="protocol">Protocol</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>

              {/* Separator and Label */}
              <div className="flex flex-row items-center justify-between pb-2">
                <Separator className="flex-1 border-white bg-white" />
                <p className="px-2 text-sm font-semibold text-white">PERSONNA</p>
                <Separator className="flex-1 border-white bg-white" />
              </div>

              {/* IQ Slider */}
              <div className="flex flex-row items-center space-x-4">
                <p className="text-xs text-white font-bold">GENIUS</p>
                <Slider defaultValue={[5]} max={10} step={1} value={[sliderIQ]} onValueChange={(value) => setSliderIQ(value[0])} />
                <p className="text-xs text-white font-bold">MORON</p>
              </div>

              {/* Cringe Slider */}
              <div className="flex flex-row items-center space-x-4">
                <p className="text-xs text-white font-bold">BASED</p>
                <Slider defaultValue={[5]} max={10} step={1} value={[sliderCringe]} onValueChange={(value) => setSliderCringe(value[0])} />
                <p className="text-xs text-white font-bold">CRINGE</p>

              </div>

              {/* Vulgarity Slider */}
              <div className="flex flex-row items-center space-x-4 pb-2">
                <p className="text-xs text-white font-bold">CLASSY</p>
                <Slider defaultValue={[5]} max={10} step={1} value={[sliderVulgar]} onValueChange={(value) => setSliderVulgar(value[0])} />
                <p className="text-xs text-white font-bold">VULGAR</p>
              </div>

              <Button type="submit" className="w-full bg-primary">
                GENERATE BULLPOST
                {isLoading ? <ReloadIcon className="ml-2 h-4 w-4 animate-spin" /> : null}
              </Button>
            </form>
          </Form>

          {bullpost && (
            <div className="p-4 border-2 border-white/70 rounded-lg mt-2">
              <div className="p-4 bg-white text-black rounded">
                <p className="text-sm">{bullpost}</p>
              </div>
              <button
                type="button"
                className="flex justify-center items-center text-white w-full bg-background hover:bg-background/90 font-sm rounded-md py-2 mt-2"
                onClick={handleTweetButtonClick}
              >
              <svg
                className="w-5 h-5 me-2"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="bitcoin"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 50 50"
              >
                <path
                  fill="currentColor"
                  d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z M 16.914062 15 L 31.021484 35 L 34.085938 35 L 19.978516 15 L 16.914062 15 z"
                ></path>
              </svg>
              SHARE BULLPOST
            </button>
            </div>

          )}
        </CardContent>
      </Card>
    </div>
  );
}
