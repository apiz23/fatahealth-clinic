"use client";

import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";
import { useRouter } from "next/navigation";

type SessionContextType = {
	isAuthenticated: boolean;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

type SessionProviderProps = {
	children: ReactNode;
};

export function SessionProvider({ children }: SessionProviderProps) {
	const router = useRouter();
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const checkSession = () => {
			const token = sessionStorage.getItem("isAuthenticated");
			if (!token) {
				router.push("/auth");
			} else {
				setIsAuthenticated(true);
			}
		};
		checkSession();
	}, [router]);

	return (
		<SessionContext.Provider value={{ isAuthenticated }}>
			{children}
		</SessionContext.Provider>
	);
}

export const useSession = (): SessionContextType => {
	const context = useContext(SessionContext);
	if (context === undefined) {
		throw new Error("useSession must be used within a SessionProvider");
	}
	return context;
};
