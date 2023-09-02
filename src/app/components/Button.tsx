import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

// only accept react elements as props
interface ButtonProp<T extends React.ElementType> {
  as?: T;
}

export default function Button<T extends React.ElementType = "button">({
  as,
  ...props
}: // this omits any props that are in ButtonProp<T> from the props of the component
ButtonProp<T> & Omit<ComponentPropsWithoutRef<T>, keyof ButtonProp<T>>) {
  // if as is undefined, use "button" as the default component
  const Component = as || "button";

  return (
    <Component
      {...props}
      // this allows us to merge the className prop with our own to override the default styles
      className={twMerge(
        "flex items-center justify-center gap-2 rounded bg-blue-500 p-[0.875rem] text-white active:bg-blue-600 disabled:bg-gray-200",
        props.className
      )}
    />
  );
}
