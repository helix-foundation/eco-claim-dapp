import React from "react";
import { toast as reactToastify } from "react-toastify";

type Intent = "basic" | "success" | "danger" | "warning" | "info";

type ToastBodyProps = {
  title: string;
  body?: string | JSX.Element;
};

const ToastBody = ({ title, body }: ToastBodyProps) => {
  return (
    <div className="font-sans text-eco-dark-gray">
      <div className="font-medium">{title}</div>
      <div className="text-sm">{body}</div>
    </div>
  );
};

type ToastProps = {
  title: string;
  body?: string | JSX.Element;
  intent?: Intent;
  hideProgressBar?: boolean;
};

const toast = ({
  title,
  body,
  intent = "basic",
  hideProgressBar = false,
}: ToastProps) => {

  const toastBody = <ToastBody title={title} body={body} />;
  const toastOptions = {
    hideProgressBar,
  };

  switch (intent) {
    case "basic":
      return reactToastify(toastBody, toastOptions);
    case "success":
      return reactToastify.success(toastBody, toastOptions);
    case "danger":
      return reactToastify.error(toastBody, toastOptions);
    case "warning":
      return reactToastify.warning(toastBody, toastOptions);
    case "info":
      return reactToastify.info(toastBody, toastOptions);
    default:
      return reactToastify(toastBody, toastOptions);
  }
};

export default toast;