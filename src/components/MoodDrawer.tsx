"use client";

import React from "react";
import { SmileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

// Define the mood options
const moodOptions = [
  { value: "开心", label: "开心" },
  { value: "得意", label: "得意" },
  { value: "难过", label: "难过" },
  { value: "孤独", label: "孤独" },
  { value: "委屈", label: "委屈" },
  { value: "梦境", label: "梦境" },
  { value: "充实", label: "充实" },
  { value: "暖心", label: "暖心" },
  { value: "烦躁", label: "烦躁" },
  { value: "生气", label: "生气" },
  { value: "不知道", label: "不知道" },
  { value: "疲惫", label: "疲惫" },
  { value: "惊喜", label: "惊喜" },
  { value: "平静", label: "平静" },
  { value: "迷惘", label: "迷惘" },
  { value: "尴尬", label: "尴尬" },
  { value: "甜蜜", label: "甜蜜" },
  { value: "逃避", label: "逃避" },
];

type MoodDrawerProps = {
  onMoodSelect: (mood: string | null) => void;
  selectedMood: string | null;
  disabled?: boolean;
};

export function MoodDrawer({ onMoodSelect, selectedMood, disabled = false }: MoodDrawerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-primary"
          disabled={disabled}
        >
          <SmileIcon className="size-4 mr-2" />
          {selectedMood || "Mood"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Select your mood</DrawerTitle>
            <DrawerDescription>Choose how you're feeling right now</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 grid grid-cols-3 gap-3">
            {moodOptions.map((mood) => (
              <Button
                key={mood.value}
                variant={selectedMood === mood.value ? "default" : "outline"}
                onClick={() => {
                  onMoodSelect(mood.value);
                  setOpen(false);
                }}
                className="h-12"
              >
                {mood.label}
              </Button>
            ))}
          </div>
          <DrawerFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                onMoodSelect(null);
                setOpen(false);
              }}
            >
              Cancel
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default MoodDrawer;
