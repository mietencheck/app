import React from "react";
import { AriaLinkOptions, useLink } from "react-aria";

export function LinkOld(props: AriaLinkOptions & React.ComponentProps<"a">) {
  const ref = React.useRef(null);
  const { linkProps } = useLink(props, ref);

  return (
    <a
      {...linkProps}
      ref={ref}
      href={props.href}
      target={props.target}
      className={props.className}
    >
      {props.children}
    </a>
  );
}
