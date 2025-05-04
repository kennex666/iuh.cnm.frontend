import React, {createContext, ReactNode, useContext, useState} from "react";
import TabBarManager from "@/src/contexts/tabbar/manager/TabBarManager";

interface TabBarContextType {
    isVisible: boolean;
    showTabBar: () => void;
    hideTabBar: () => void;
}

interface TabBarProviderProps {
    children: ReactNode;
}

const TabBarContext = createContext<TabBarContextType>({
    isVisible: true,
    showTabBar: () => {
    },
    hideTabBar: () => {
    },
});

export const useTabBar = () => useContext(TabBarContext);

export const TabBarProvider = ({children}: TabBarProviderProps) => {
    const [isVisible, setIsVisible] = useState(TabBarManager.isVisible);

    const handleShowTabBar = () => {
        TabBarManager.show();
        setIsVisible(true);
    };

    const handleHideTabBar = () => {
        TabBarManager.hide();
        setIsVisible(false);
    };

    return (
        <TabBarContext.Provider
            value={{
                isVisible,
                showTabBar: handleShowTabBar,
                hideTabBar: handleHideTabBar,
            }}
        >
            {children}
        </TabBarContext.Provider>
    );
};
