import React, { createContext, useContext, useState } from "react";

type TabBarContextType = {
	isVisible: boolean;
	showTabBar: () => void;
	hideTabBar: () => void;
};

const TabBarContext = createContext<TabBarContextType | undefined>(undefined);

export const TabBarProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isVisible, setIsVisible] = useState(true);

	const value: TabBarContextType = {
		isVisible,
		showTabBar: () => setIsVisible(true),
		hideTabBar: () => setIsVisible(false),
	};

	return (
		<TabBarContext.Provider value={value}>
			{children}
		</TabBarContext.Provider>
	);
};

export const useTabBar = () => {
	const context = useContext(TabBarContext);
	if (!context)
		throw new Error("useTabBar must be used within TabBarProvider");
	return context;
};
