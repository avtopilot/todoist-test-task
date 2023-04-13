import React, { ReactNode, useContext } from "react";

type NotifierConfig = {
  notifyBusy: (enable: boolean) => void;
  showError: (message: string) => void;
};

type NotifierProps = NotifierConfig & {
  children: ReactNode;
};

const NotifierContext = React.createContext<NotifierConfig | null>(null);

export const Notifier = (props: NotifierProps) => {
  const config: NotifierConfig = {
    notifyBusy: props.notifyBusy,
    showError: props.showError,
  };

  return (
    <NotifierContext.Provider value={config}>
      {props.children}
    </NotifierContext.Provider>
  );
};

export function useNotifier(): NotifierConfig {
  const notifierContext = useContext(NotifierContext);
  if (notifierContext === null) {
    throw new Error("Notified context is not provided");
  }
  return notifierContext;
}
