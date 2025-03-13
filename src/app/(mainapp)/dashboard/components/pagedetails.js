"use client";

import React from "react";
import { Modal, ModalContent, ModalBody, Button } from "@heroui/react";

export default function PageDetails({ isOpen, onClose, emotionData }) {
  const emotionStyles = {
    happy: {
      color: "bg-yellow-100 border-yellow-300",
      textColor: "text-yellow-800",
    },
    sad: {
      color: "bg-blue-100 border-blue-300",
      textColor: "text-blue-800",
    },
    calm: {
      color: "bg-green-100 border-green-300",
      textColor: "text-green-800",
    },
    angry: {
      color: "bg-red-100 border-red-300",
      textColor: "text-red-800",
    },
    anxious: {
      color: "bg-purple-100 border-purple-300",
      textColor: "text-purple-800",
    },
    neutral: {
      color: "bg-gray-100 border-gray-300",
      textColor: "text-gray-800",
    },
    stressed: {
      color: "bg-orange-100 border-orange-300",
      textColor: "text-orange-800",
    },
    excited: {
      color: "bg-teal-100 border-teal-300",
      textColor: "text-teal-800",
    },
    tired: {
      color: "bg-sky-100 border-sky-300",
      textColor: "text-sky-800",
    },
    confused: {
      color: "bg-violet-100 border-violet-300",
      textColor: "text-violet-800",
    },
    loved: {
      color: "bg-pink-100 border-pink-300",
      textColor: "text-pink-800",
    },
    grateful: {
      color: "bg-lime-100 border-lime-300",
      textColor: "text-lime-800",
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
