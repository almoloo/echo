"use client";

import { useFormStatus } from "react-dom";
import LinkItem from "@/components/profile/link-item";
import { useEffect, useState } from "react";
import { defaultAvatar } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LoaderIcon, PlusIcon, SaveIcon } from "lucide-react";

interface ProfileFormProps {
  updateProfile: (formData: FormData) => Promise<void>;
  name?: string;
  email?: string;
  bio?: string;
  links: {
    title: string;
    url: string;
  }[];
  tags: string[];
  avatar?: string;
}

export default function ProfileForm(props: ProfileFormProps) {
  const { pending } = useFormStatus();
  const [formData, setFormData] = useState({
    name: props.name ?? "",
    email: props.email ?? "",
    bio: props.bio ?? "",
    links:
      props.links.map((link) => ({
        ...link,
        id: Math.random().toString(),
      })) ?? [],
    tags: props.tags ?? [],
    avatar: props.avatar ?? defaultAvatar,
  });

  function handleRemoveLink(title: string, url: string) {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter(
        (link) => link.title !== title && link.url !== url
      ),
    }));
  }

  function handleAddLink() {
    const emptyLink = formData.links.filter(
      (link) => link.title === "" && link.url === ""
    );
    if (emptyLink.length > 0) return;

    setFormData((prev) => ({
      ...prev,
      links: [
        ...prev.links,
        { title: "", url: "", id: Math.random().toString() },
      ],
    }));
  }

  function handleChangeLink(title: string, url: string, id: string) {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.map((link) => ({
        id: link.id,
        title: link.id === id ? title : link.title,
        url: link.id === id ? url : link.url,
      })),
    }));
  }

  return (
    <>
      <fieldset className="flex flex-col gap-1.5">
        <Label htmlFor="name">Name*</Label>
        <Input
          id="name"
          value={formData.name}
          name="name"
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
      </fieldset>

      <fieldset className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={formData.email}
          name="email"
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
        />
      </fieldset>

      <fieldset className="flex flex-col gap-1.5">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          name="bio"
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, bio: e.target.value }))
          }
        />
      </fieldset>

      <div className="flex flex-col gap-2">
        <Label>Links</Label>
        {formData.links.map((link) => (
          <LinkItem
            title={link.title}
            url={link.url}
            key={link.id}
            id={link.id}
            handleRemove={handleRemoveLink}
            handleChange={handleChangeLink}
          />
        ))}
        <Button
          variant="outline"
          className="self-start"
          onClick={handleAddLink}
          type="button"
          disabled={
            pending ||
            formData.links.filter(
              (link) => link.title === "" && link.url === ""
            ).length > 0
          }
        >
          <PlusIcon />
          Add Link
        </Button>
      </div>

      <fieldset className="flex flex-col gap-1.5">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={formData.tags.join(",")}
          name="tags"
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              tags: e.target.value.split(",").map((tag) => tag.trim()),
            }))
          }
        />
        <small className="text-slate-500 text-xs">
          Divide tags with comma(,).
        </small>
      </fieldset>

      <input
        type="hidden"
        name="avatar"
        placeholder="avatar"
        defaultValue={props.avatar}
        readOnly
      />

      <Button type="submit" className="self-start" disabled={pending}>
        {pending ? <LoaderIcon className="animate-spin" /> : <SaveIcon />}
        Save Profile
      </Button>
    </>
  );
}
