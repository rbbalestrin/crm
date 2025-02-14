import React, { useState, useEffect } from "react";

import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "react-query";

import { enUS, ptBR, esES } from "@material-ui/core/locale";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";
import ColorModeContext from "./layout/themeContext";
import { SocketContext, SocketManager } from "./context/Socket/SocketContext";

import Routes from "./routes";

// Import Lato font
import "@fontsource/lato/300.css";
import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";
import "@fontsource/lato/900.css";

const queryClient = new QueryClient();

const App = () => {
	const [locale, setLocale] = useState();

	const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
	const preferredTheme = window.localStorage.getItem("preferredTheme");
	const [mode, setMode] = useState(
		preferredTheme ? preferredTheme : prefersDarkMode ? "dark" : "light"
	);

	const colorMode = React.useMemo(
		() => ({
			toggleColorMode: () => {
				setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
			},
		}),
		[]
	);

	const theme = createTheme(
		{
			typography: {
				fontFamily: "Lato, sans-serif",
				h1: { fontWeight: 900 },
				h2: { fontWeight: 900 },
				h3: { fontWeight: 700 },
				h4: { fontWeight: 700 },
				h5: { fontWeight: 700 },
				h6: { fontWeight: 700 },
				subtitle1: { fontWeight: 400 },
				subtitle2: { fontWeight: 400 },
				body1: { fontWeight: 400 },
				body2: { fontWeight: 400 },
				button: { fontWeight: 700 },
			},
			scrollbarStyles: {
				"&::-webkit-scrollbar": {
					width: "8px",
					height: "8px",
				},
				"&::-webkit-scrollbar-thumb": {
					boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.3)",
					backgroundColor: "#EF3D5B",
				},
			},
			scrollbarStylesSoft: {
				"&::-webkit-scrollbar": {
					width: "8px",
				},
				"&::-webkit-scrollbar-thumb": {
					backgroundColor: mode === "light" ? "#F3F3F3" : "#333333",
				},
			},
			palette: {
				type: mode,
				primary: { main: mode === "light" ? "#EF3D5B" : "#FFFFFF" },
				secondary: { main: "#1E88E5" },
				background: {
					default: mode === "light" ? "#F5F5F7" : "#1C1C1C",
					paper: mode === "light" ? "#FFFFFF" : "#2D2D2D",
				},
				textPrimary: mode === "light" ? "#EF3D5B" : "#FFFFFF",
				borderPrimary: mode === "light" ? "#EF3D5B" : "#FFFFFF",
				dark: { main: mode === "light" ? "#333333" : "#F3F3F3" },
				light: { main: mode === "light" ? "#F3F3F3" : "#333333" },
				success: { main: "#2E7D32" },
				warning: { main: "#ED6C02" },
				error: { main: "#D32F2F" },
				tabHeaderBackground: mode === "light" ? "#F5F5F7" : "#2D2D2D",
				optionsBackground: mode === "light" ? "#FFFFFF" : "#2D2D2D",
				options: mode === "light" ? "#FFFFFF" : "#2D2D2D",
				fontecor: mode === "light" ? "#128c7e" : "#fff",
				fancyBackground: mode === "light" ? "#FFFFFF" : "#2D2D2D",
				bordabox: mode === "light" ? "#E0E0E0" : "#333",
				newmessagebox: mode === "light" ? "#F5F5F7" : "#333",
				inputdigita: mode === "light" ? "#FFFFFF" : "#2D2D2D",
				contactdrawer: mode === "light" ? "#FFFFFF" : "#2D2D2D",
				announcements: mode === "light" ? "#F5F5F7" : "#333",
				login: mode === "light" ? "#FFFFFF" : "#1C1C1C",
				announcementspopover: mode === "light" ? "#FFFFFF" : "#2D2D2D",
				chatlist: mode === "light" ? "#F5F5F7" : "#2D2D2D",
				boxlist: mode === "light" ? "#F5F5F7" : "#2D2D2D",
				boxchatlist: mode === "light" ? "#F5F5F7" : "#333",
				total: mode === "light" ? "#FFFFFF" : "#222",
				messageIcons: mode === "light" ? "#757575" : "#F3F3F3",
				inputBackground: mode === "light" ? "#FFFFFF" : "#2D2D2D",
				barraSuperior:
					mode === "light"
						? `linear-gradient(to right, #EF3D5B, #FF6B88)`
						: "#2D2D2D",
				boxticket: mode === "light" ? "#F5F5F7" : "#2D2D2D",
				campaigntab: mode === "light" ? "#F5F5F7" : "#2D2D2D",
				mediainput: mode === "light" ? "#F5F5F7" : "#1c1c1c",
			},
			shape: {
				borderRadius: 10,
			},
			shadows:
				mode === "light"
					? [
							"none",
							"0px 2px 1px -1px rgba(0,0,0,0.06),0px 1px 1px 0px rgba(0,0,0,0.04),0px 1px 3px 0px rgba(0,0,0,0.02)",
							"0px 3px 3px -2px rgba(0,0,0,0.06),0px 2px 4px 0px rgba(0,0,0,0.04),0px 1px 8px 0px rgba(0,0,0,0.02)",
							...Array(22).fill("none"),
					  ]
					: undefined,
			mode,
		},
		locale
	);

	useEffect(() => {
		const i18nlocale = localStorage.getItem("i18nextLng");
		const browserLocale = i18nlocale?.substring(0, 2) ?? "pt";

		if (browserLocale === "pt") {
			setLocale(ptBR);
		} else if (browserLocale === "en") {
			setLocale(enUS);
		} else if (browserLocale === "es") setLocale(esES);
	}, []);

	useEffect(() => {
		window.localStorage.setItem("preferredTheme", mode);
	}, [mode]);

	return (
		<ColorModeContext.Provider value={{ colorMode }}>
			<ThemeProvider theme={theme}>
				<QueryClientProvider client={queryClient}>
					<SocketContext.Provider value={SocketManager}>
						<Routes />
					</SocketContext.Provider>
				</QueryClientProvider>
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
};

export default App;
