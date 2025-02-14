import React, { useState, useEffect } from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Line } from "react-chartjs-2";
import { i18n } from "../../translate/i18n";
import useDashboard from "../../hooks/useDashboard";
import { format } from "date-fns";

const useStyles = makeStyles((theme) => ({
	chartContainer: {
		padding: theme.spacing(2),
		height: "100%",
		display: "flex",
		flexDirection: "column",
	},
	chartHeader: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: theme.spacing(3),
	},
	title: {
		fontWeight: 500,
		color: theme.palette.text.primary,
	},
	chartWrapper: {
		flex: 1,
		minHeight: 300,
	},
}));

const ChartsDate = ({ dateStartTicket, dateEndTicket }) => {
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [chartData, setChartData] = useState(null);
	const { findDailyStats } = useDashboard();

	useEffect(() => {
		async function fetchData() {
			setLoading(true);
			try {
				const data = await findDailyStats(dateStartTicket, dateEndTicket);
				const formattedData = formatChartData(data);
				setChartData(formattedData);
			} catch (error) {
				console.error(error);
			}
			setLoading(false);
		}
		fetchData();
	}, [dateStartTicket, dateEndTicket]);

	const formatChartData = (data) => {
		const labels = data.map((item) => item.date);
		const datasets = [
			{
				label: i18n.t("dashboard.charts.date.title"),
				data: data.map((item) => item.count),
				fill: true,
				backgroundColor: "rgba(239, 61, 91, 0.1)",
				borderColor: "#EF3D5B",
				tension: 0.4,
				pointRadius: 4,
				pointBackgroundColor: "#EF3D5B",
				pointBorderColor: "#fff",
				pointBorderWidth: 2,
			},
		];

		return {
			labels,
			datasets,
		};
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				mode: "index",
				intersect: false,
				backgroundColor: "rgba(255, 255, 255, 0.9)",
				titleColor: "#000",
				bodyColor: "#666",
				borderColor: "#EF3D5B",
				borderWidth: 1,
				padding: 12,
				boxPadding: 4,
			},
		},
		scales: {
			x: {
				grid: {
					display: false,
				},
				ticks: {
					maxRotation: 0,
				},
			},
			y: {
				beginAtZero: true,
				grid: {
					borderDash: [2],
					color: "rgba(0, 0, 0, 0.1)",
				},
			},
		},
	};

	return (
		<Box className={classes.chartContainer}>
			<Box className={classes.chartHeader}>
				<Typography variant="h6" className={classes.title}>
					{i18n.t("dashboard.charts.date.label")}
				</Typography>
			</Box>
			<Box className={classes.chartWrapper}>
				{chartData && <Line data={chartData} options={options} />}
			</Box>
		</Box>
	);
};

export default ChartsDate;
