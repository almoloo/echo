"use client";

import { useEffect, useState } from "react";

interface LinkItemProps {
  title: string;
  url: string;
  index: number;
}

export default function LinkItem({ title, url, index }: LinkItemProps) {
  const [linkTitle, setLinkTitle] = useState(title);
  const [linkUrl, setLinkUrl] = useState(url);
  const [linkValue, setLinkValue] = useState(JSON.stringify({ title, url }));

  useEffect(() => {
    setLinkValue(JSON.stringify({ title: linkTitle, url: linkUrl }));
  }, [linkTitle, linkUrl]);

  return (
    <div>
      <input
        type="text"
        defaultValue={title}
        onChange={(e) => setLinkTitle(e.currentTarget.value)}
      />
      <input
        type="text"
        defaultValue={url}
        onChange={(e) => setLinkUrl(e.currentTarget.value)}
      />
      <input type="hidden" name="links" value={linkValue} readOnly />
    </div>
  );
}
