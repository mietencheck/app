import React from "react";

export const InfoBox = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-8 space-y-6">
    <div className="space-y-2">
      <h2 className="text-base-book">Was bedeutet das?</h2>
      {React.Children.map(children, (child, i) => (
        <p key={i} className="text-base text-neutral-faded">
          {child}
        </p>
      ))}
    </div>
  </div>
);
