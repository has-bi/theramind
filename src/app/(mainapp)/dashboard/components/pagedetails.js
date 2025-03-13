"use client";

import React from "react";
import { Modal, ModalContent, ModalBody, Button } from "@heroui/react";
import Image from "next/image";

export default function PageDetails({ isOpen, onClose, emotionData }) {
  const emotionStyles = {
    happy: {
      color: "bg-mood-happy-light border-mood-happy",
      textColor: "text-mood-happy",
      imagePath: "/images/emotions/happy.png",
    },
    sad: {
      color: "bg-mood-sad-light border-mood-sad",
      textColor: "text-mood-sad",
      imagePath: "/images/emotions/sad.png",
    },
    calm: {
      color: "bg-mood-calm-light border-mood-calm",
      textColor: "text-mood-calm",
      imagePath: "/images/emotions/calm.png",
    },
    angry: {
      color: "bg-mood-angry-light boder-mood-angry",
      textColor: "text-mood-angry",
      imagePath: "/images/emotions/angry.png",
    },
    anxious: {
      color: "bg-mood-anxious-light border-mood-anxious",
      textColor: "text-mood-anxious",
      imagePath: "/images/emotions/anxious.png",
    },
    neutral: {
      color: "bg-mood-neutral-light border-mood-neutral",
      textColor: "text-mood-neutral",
      imagePath: "/images/emotions/neutral.png",
    },
    stressed: {
      color: "bg-mood-stressed-light border-stressed",
      textColor: "text-mood-stressed",
      imagePath: "/images/emotions/stressed.png",
    },
    excited: {
      color: "bg-mood-excited-light border-mood-excited",
      textColor: "text-mood-excited",
      imagePath: "/images/emotions/excited.png",
    },
    tired: {
      color: "bg-mood-tired-light border-mood-tired",
      textColor: "text-mood-tired",
      imagePath: "/images/emotions/tired.png",
    },
    confused: {
      color: "bg-mood-confused-light border-mood-confused",
      textColor: "text-mood-confused",
      imagePath: "/images/emotions/confused.png",
    },
    loved: {
      color: "bg-mood-loved-light border-mood-loved",
      textColor: "text-mood-loved",
      imagePath: "/images/emotions/loved.png",
    },
    grateful: {
      color: "bg-mood-grateful-light border-mood-grateful",
      textColor: "text-mood-grateful",
      imagePath: "/images/emotions/grateful.png",
    },
  };

  const emotionType = emotionData?.emotionName?.toLowerCase() || "";
  const style = emotionStyles[emotionType] || emotionStyles.neutral;

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center" hideCloseButton>
      <ModalContent>
        <ModalBody>
          <div className="flex mx-auto max-w-sm p-1">
            <div className="rounded-xl bg-slate-100 border border-slate-300 p-4 shadow-sm w-full">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Recap</h2>
                <div className="flex items-center">
                  <span className={`text-sm font-medium ${style.textColor} mr-2`}>
                    {emotionData?.emotionName}
                  </span>
                  <Image
                    src={style.imagePath}
                    alt={emotionType}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
              </div>

              <div className={`border-t ${style.color} my-3`}></div>

              <div className="mt-2">
                <p className="text-gray-700 text-sm">
                  {emotionData?.recap || "You dont have recap for this day."}
                </p>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-500">{formatDate(emotionData?.createdAt)}</span>
                <Button variant="primary" color="warning" onPress={onClose}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
