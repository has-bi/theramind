"use client";

import React from "react";
import { Modal, ModalContent, ModalBody, Button } from "@heroui/react";

export default function PageDetails({ isOpen, onClose, emotionData }) {
  const emotionStyles = {
    happy: {
      color: "bg-mood-happy border-mood-happy",
      textColor: "text-mood-happy",
    },
    sad: {
      color: "bg-mood-sad border-mood-sad",
      textColor: "text-mood-sad",
    },
    calm: {
      color: "bg-mood-calm border-mood-calm",
      textColor: "text-mood-calm",
    },
    angry: {
      color: "bg-mood-angry boder-mood-angry",
      textColor: "text-mood-angry",
    },
    anxious: {
      color: "bg-mood-anxious border-mood-anxious",
      textColor: "text-mood-anxious",
    },
    neutral: {
      color: "bg-mood-neutral border-mood-neutral",
      textColor: "text-mood-neutral",
    },
    stressed: {
      color: "bg-mood-stressed border-stressed",
      textColor: "text-mood-stressed",
    },
    excited: {
      color: "bg-mood-excited border-mood-excited",
      textColor: "text-mood-excited",
    },
    tired: {
      color: "bg-mood-tired border-mood-tired",
      textColor: "text-mood-tired",
    },
    confused: {
      color: "bg-mood-confused border-mood-confused",
      textColor: "text-mood-confused",
    },
    loved: {
      color: "bg-mood-loved border-mood-loved",
      textColor: "text-mood-loved",
    },
    grateful: {
      color: "bg-mood-grateful border-mood-grateful",
      textColor: "text-mood-grateful",
    },
  };

  const emotionType = emotionData?.type?.toLowerCase() || "neutral";
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
    <Modal isOpen={isOpen} onClose={onClose} hideCloseButton>
      <ModalContent>
        <ModalBody>
          <div className="flex mx-auto max-w-sm p-1">
            <div className={`rounded-xl ${style.color} border p-4 shadow-sm`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {formatDate(emotionData?.createdAt)}
                  </h3>
                </div>
                <div
                  className={`rounded-full px-3 py-1 text-sm font-medium ${style.textColor} flex items-center`}
                >
                  <span className="capitalize">{emotionType}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 my-3"></div>

              <div className="mt-2">
                <h2 className="text-lg font-semibold mb-2">Recap</h2>
                <p className="text-gray-700 text-sm">
                  {emotionData?.journalai?.summary || `You felt ${emotionType} on this day.`}
                </p>
              </div>
              <div className="flex justify-end">
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
