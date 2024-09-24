"use client";

import { Button } from "@/components/ui/button";
import { doCreateUser } from "../(panel)/action";
import { useState } from "react";
import { FunctionButton } from "@/components/loading-button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/icons";

export function RegisterButton(props: { email: string; text: string }) {
  const [email, setEmail] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);

  return (
    <div>
      <FunctionButton
        className="w-full"
        onClick={async () => {
          const message = await doCreateUser(props.email, false);
          if (message) {
            console.log(message);
            const successMessage = message.match(/Successfully created[\s\S]*$/);
            if (successMessage) {
              const emailMatch = successMessage[0].match(/\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
              const linkMatch = successMessage[0].match(/http.*$/m);
              if (emailMatch) {
                setEmail(emailMatch[1] || "");
                console.log(emailMatch[1]);
              }
              if (linkMatch) {
                setLink(linkMatch[0]);
                console.log(linkMatch[0]);
              }
            } else {
              setEmail("Failed to create account");
            }
          }
        }}
      >
        {props.text}
      </FunctionButton>
      {link && (

        <div className="text-md mt-2 space-y-3">
          <Separator className="my-6" />
          <p>Success. Click the button below to open the registration page:</p>
          <Button className="my-2 w-full" asChild>
            
            <Link href={link}><Icons.externalLink className="w-4 mr-2" /> Open Registration Page</Link>
          </Button>
          <p className="text-sm text-gray-500">Or copy the link below and open it manually:</p>
          <Input className="my-2" value={link} />
      <p className="text-sm text-gray-500">
        Note: If you have already fin an account, although clicking the button will show a new registration url, the
        registration url will have no effect.
      </p>
        </div>
      )}
    </div>
  );
}
