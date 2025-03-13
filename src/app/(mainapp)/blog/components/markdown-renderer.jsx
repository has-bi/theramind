// "use client";

// import React from "react";
// import ReactMarkdown from "react-markdown";

// export const MarkDownRenderer = ({ content }) => {
//   return (
//     <ReactMarkdown
//       components={{
//         ul: props => {
//           return <ul {...props} className="space-y-0" />;
//         },
//         li: props => {
//           return <li {...props} className="list-disc list-item list-inside" />;
//         },
//         blockquote: props => {
//           return (
//             <p
//               {...props}
//               className="bg-amber-100 text-amber-950 py-2 px-4 rounded-lg border border-amber-500"
//             />
//           );
//         },
//         p: props => {
//           return <p {...props} className="p-0 m-0" />;
//         },
//       }}
//     >
//       {content}
//     </ReactMarkdown>
//   );
// };

"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

export const MarkDownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      components={{
        // Heading styling with reduced spacing
        h1: props => {
          return <h1 {...props} className="text-2xl font-bold mt-4 mb-2" />;
        },
        h2: props => {
          return <h2 {...props} className="text-xl font-bold mt-3 mb-2 text-gray-800" />;
        },
        h3: props => {
          return <h3 {...props} className="text-lg font-semibold mt-3 mb-1" />;
        },
        h4: props => {
          return <h4 {...props} className="text-base font-semibold mt-2 mb-1" />;
        },
        h5: props => {
          return <h5 {...props} className="text-sm font-semibold mt-2 mb-1" />;
        },
        h6: props => {
          return <h6 {...props} className="text-xs font-semibold mt-2 mb-1" />;
        },

        // List styling with tighter spacing
        ul: props => {
          return <ul {...props} className="my-1 pl-1" />;
        },
        ol: props => {
          return <ol {...props} className="my-1 pl-1 list-decimal list-inside" />;
        },
        li: props => {
          return <li {...props} className="list-disc list-item list-inside mb-0" />;
        },

        // Paragraph styling with better line height
        p: props => {
          return <p {...props} className="my-2 leading-relaxed text-left p-0 m-0" />;
        },

        // Quote styling
        blockquote: props => {
          return (
            <div
              {...props}
              className="bg-amber-100 text-amber-950 py-2 px-4 my-2 rounded-lg border border-amber-500"
            />
          );
        },

        // Emphasis styling
        em: props => {
          return <em {...props} className="italic" />;
        },
        strong: props => {
          return <strong {...props} className="font-bold" />;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
