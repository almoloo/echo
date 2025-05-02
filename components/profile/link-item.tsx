"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";

interface LinkItemProps {
  title: string;
  url: string;
  id: string;
  handleChange: (title: string, url: string, id: string) => void;
  handleRemove: (title: string, url: string) => void;
}

export default function LinkItem({
  title,
  url,
  id,
  handleRemove,
  handleChange,
}: LinkItemProps) {
  const [linkTitle, setLinkTitle] = useState(title);
  const [linkUrl, setLinkUrl] = useState(url);
  const [linkValue, setLinkValue] = useState(JSON.stringify({ title, url }));

  useEffect(() => {
    handleChange(linkTitle, linkUrl, id);
    setLinkValue(JSON.stringify({ title: linkTitle, url: linkUrl }));
  }, [linkTitle, linkUrl]);

  return (
    <div className="flex gap-3 p-3 border rounded-sm">
      <fieldset className="flex flex-col gap-1.5">
        <Label className="flex flex-col items-start">
          <span>Title</span>
          <Input
            type="text"
            defaultValue={linkTitle}
            onChange={(e) => setLinkTitle(e.currentTarget.value)}
            required
          />
        </Label>
      </fieldset>
      <fieldset className="flex flex-col gap-1.5">
        <Label className="flex flex-col items-start">
          <span>URL</span>
          <Input
            type="url"
            defaultValue={linkUrl}
            onChange={(e) => setLinkUrl(e.currentTarget.value)}
            required
          />
        </Label>
      </fieldset>
      <Button
        variant="secondary"
        size="icon"
        className="self-end ml-auto"
        onClick={() => handleRemove(linkTitle, linkUrl)}
        type="button"
      >
        <Trash2Icon />
      </Button>
      <input type="hidden" name="links" value={linkValue} readOnly />
    </div>
  );
}
