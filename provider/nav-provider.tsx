"use client";

import { createContext, useContext, useState } from "react";

type NavigationContextType = {
	activeTitle: string;
	setActiveTitle: (title: string) => void;
};

const NavigationContext = createContext<NavigationContextType | undefined>(
	undefined
);

export const NavigationProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [activeTitle, setActiveTitle] = useState("Dashboard");

	return (
		<NavigationContext.Provider value={{ activeTitle, setActiveTitle }}>
			{children}
		</NavigationContext.Provider>
	);
};

export const useNavigation = () => {
	const context = useContext(NavigationContext);
	if (!context) {
		throw new Error("useNavigation must be used within a NavigationProvider");
	}
	return context;
};
