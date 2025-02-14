import React, { useContext, useState, useEffect } from "react";

import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import InputAdornment from "@material-ui/core/InputAdornment";

import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";

import GroupIcon from "@material-ui/icons/Group";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import PhoneInTalkIcon from "@material-ui/icons/PhoneInTalk";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import TimerIcon from "@material-ui/icons/Timer";

import { toast } from "react-toastify";

import useDashboard from "../../hooks/useDashboard";
import { i18n } from "../../translate/i18n";
import CustomerTable from "../../components/CustomerTable";
import ChartsDate from "./ChartsDate";
import ChartsUser from "./ChartsUser";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
	container: {
		padding: theme.spacing(3),
	},
	paper: {
		padding: theme.spacing(2),
		borderRadius: theme.shape.borderRadius,
		backgroundColor: theme.palette.background.paper,
	},
	cardStats: {
		padding: theme.spacing(2),
		borderRadius: theme.shape.borderRadius,
		backgroundColor: theme.palette.background.paper,
		height: 140,
		maxWidth: 280,
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		border: `1px solid ${theme.palette.divider}`,
		transition: "all 0.3s ease",
		"&:hover": {
			boxShadow: theme.shadows[4],
			borderColor: theme.palette.primary.main,
		},
	},
	cardIcon: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
		borderRadius: theme.shape.borderRadius,
		padding: theme.spacing(1),
		width: 36,
		height: 36,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		"& svg": {
			fontSize: 20,
		},
	},
	cardContent: {
		display: "flex",
		gap: theme.spacing(2),
		alignItems: "flex-start",
	},
	searchBox: {
		position: "relative",
		marginBottom: theme.spacing(3),
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(1),
		borderRadius: theme.shape.borderRadius,
		display: "flex",
		alignItems: "center",
		gap: theme.spacing(1),
	},
	searchInput: {
		flex: 1,
		"& .MuiOutlinedInput-root": {
			borderRadius: theme.shape.borderRadius,
		},
	},
	tableContainer: {
		flex: 1,
		overflowY: "auto",
		...theme.scrollbarStyles,
	},
	headerTitle: {
		fontSize: "24px",
		fontWeight: 500,
		marginBottom: theme.spacing(3),
	},
	filterBox: {
		display: "flex",
		gap: theme.spacing(1),
		marginBottom: theme.spacing(3),
	},
	statValue: {
		fontSize: "1.5rem",
		fontWeight: 700,
		color: theme.palette.text.primary,
		marginBottom: theme.spacing(0.5),
	},
	statLabel: {
		fontSize: "0.875rem",
		color: theme.palette.text.secondary,
		whiteSpace: "nowrap",
	},
	statChange: {
		fontSize: "0.75rem",
		display: "flex",
		alignItems: "center",
		gap: theme.spacing(0.5),
		marginTop: theme.spacing(1),
	},
	positiveChange: {
		color: theme.palette.success.main,
	},
	negativeChange: {
		color: theme.palette.error.main,
	},
}));

const Dashboard = () => {
	const classes = useStyles();
	const theme = useTheme();
	const [counters, setCounters] = useState({});
	const [period, setPeriod] = useState(0);
	const [loading, setLoading] = useState(false);
	const [dateStartTicket, setDateStartTicket] = useState(new Date());
	const [dateEndTicket, setDateEndTicket] = useState(new Date());
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [statsChange, setStatsChange] = useState({
		customers: 0,
		finished: 0,
		active: 0,
		newContacts: 0,
		avgTalkTime: 0,
		avgWaitTime: 0,
	});
	const { find } = useDashboard();

	useEffect(() => {
		async function firstLoad() {
			await fetchData();
			await calculateStatsChange();
		}
		firstLoad();
	}, []);

	const calculateStatsChange = async () => {
		// Get data for previous period to calculate change
		const previousPeriodEnd = new Date(dateStartTicket);
		previousPeriodEnd.setMonth(previousPeriodEnd.getMonth() - 1);
		const previousData = await find(previousPeriodEnd, dateStartTicket);

		if (previousData && counters) {
			setStatsChange({
				customers: calculatePercentageChange(
					previousData.supportHasRead,
					counters.supportHasRead
				),
				finished: calculatePercentageChange(
					previousData.supportFinished,
					counters.supportFinished
				),
				active: calculatePercentageChange(
					previousData.supportPending,
					counters.supportPending
				),
				newContacts: calculatePercentageChange(
					previousData.supportNew,
					counters.supportNew
				),
				avgTalkTime: calculatePercentageChange(
					parseFloat(previousData.avgSupportTime),
					parseFloat(counters.avgSupportTime)
				),
				avgWaitTime: calculatePercentageChange(
					parseFloat(previousData.avgWaitTime),
					parseFloat(counters.avgWaitTime)
				),
			});
		}
	};

	const calculatePercentageChange = (oldValue, newValue) => {
		if (!oldValue || !newValue) return 0;
		const oldNum =
			typeof oldValue === "string" ? parseFloat(oldValue) : oldValue;
		const newNum =
			typeof newValue === "string" ? parseFloat(newValue) : newValue;
		return Math.round(((newNum - oldNum) / oldNum) * 100);
	};

	async function fetchData() {
		setLoading(true);

		try {
			const data = await find();
			setCounters(data);
		} catch (err) {
			toast.error(err.message);
		}

		setLoading(false);
	}

	const mockCustomers = [
		{
			id: 1,
			name: "Jane Cooper",
			company: "Microsoft",
			phone: "(225) 555-0118",
			email: "jane@microsoft.com",
			country: "United States",
			status: "Active",
		},
		{
			id: 2,
			name: "Floyd Miles",
			company: "Yahoo",
			phone: "(205) 555-0100",
			email: "floyd@yahoo.com",
			country: "Kiribati",
			status: "Inactive",
		},
		{
			id: 3,
			name: "Ronald Richards",
			company: "Adobe",
			phone: "(302) 555-0107",
			email: "ronald@adobe.com",
			country: "Israel",
			status: "Inactive",
		},
		{
			id: 4,
			name: "Marvin McKinney",
			company: "Tesla",
			phone: "(252) 555-0126",
			email: "marvin@tesla.com",
			country: "Iran",
			status: "Active",
		},
		{
			id: 5,
			name: "Jerome Bell",
			company: "Google",
			phone: "(629) 555-0129",
			email: "jerome@google.com",
			country: "Réunion",
			status: "Active",
		},
	];

	return (
		<Container maxWidth="lg" className={classes.container}>
			<Typography variant="h5" className={classes.headerTitle}>
				{i18n.t("dashboard.title")} 👋
			</Typography>

			<Grid container spacing={3}>
				{/* Total Customers */}
				<Grid item xs={12} sm={6} md={3}>
					<Paper elevation={0} className={classes.cardStats}>
						<Box className={classes.cardContent}>
							<Box className={classes.cardIcon}>
								<GroupIcon />
							</Box>
							<Box>
								<Typography className={classes.statValue}>
									{counters.supportHasRead || 0}
								</Typography>
								<Typography className={classes.statLabel}>
									{i18n.t("dashboard.cards.totalCustomers")}
								</Typography>
							</Box>
						</Box>
						<Box
							className={clsx(classes.statChange, {
								[classes.positiveChange]: statsChange.customers > 0,
								[classes.negativeChange]: statsChange.customers < 0,
							})}
						>
							{statsChange.customers > 0 ? "↑" : "↓"}{" "}
							{Math.abs(statsChange.customers)}%{" "}
							{i18n.t("dashboard.cards.thisMonth")}
						</Box>
					</Paper>
				</Grid>

				{/* Finished */}
				<Grid item xs={12} sm={6} md={3}>
					<Paper elevation={0} className={classes.cardStats}>
						<Box className={classes.cardContent}>
							<Box className={classes.cardIcon}>
								<CheckCircleIcon />
							</Box>
							<Box>
								<Typography className={classes.statValue}>
									{counters.supportFinished || 0}
								</Typography>
								<Typography className={classes.statLabel}>
									{i18n.t("dashboard.cards.finished")}
								</Typography>
							</Box>
						</Box>
						<Box
							className={clsx(classes.statChange, {
								[classes.positiveChange]: statsChange.finished > 0,
								[classes.negativeChange]: statsChange.finished < 0,
							})}
						>
							{statsChange.finished > 0 ? "↑" : "↓"}{" "}
							{Math.abs(statsChange.finished)}%{" "}
							{i18n.t("dashboard.cards.thisMonth")}
						</Box>
					</Paper>
				</Grid>

				{/* Active Now */}
				<Grid item xs={12} sm={6} md={3}>
					<Paper elevation={0} className={classes.cardStats}>
						<Box className={classes.cardContent}>
							<Box className={classes.cardIcon}>
								<PhoneInTalkIcon />
							</Box>
							<Box>
								<Typography className={classes.statValue}>
									{counters.supportPending || 0}
								</Typography>
								<Typography className={classes.statLabel}>
									{i18n.t("dashboard.cards.activeNow")}
								</Typography>
							</Box>
						</Box>
						<Box
							className={clsx(classes.statChange, {
								[classes.positiveChange]: statsChange.active > 0,
								[classes.negativeChange]: statsChange.active < 0,
							})}
						>
							{statsChange.active > 0 ? "↑" : "↓"}{" "}
							{Math.abs(statsChange.active)}%{" "}
							{i18n.t("dashboard.cards.thisMonth")}
						</Box>
					</Paper>
				</Grid>

				{/* New Contacts */}
				<Grid item xs={12} sm={6} md={3}>
					<Paper elevation={0} className={classes.cardStats}>
						<Box className={classes.cardContent}>
							<Box className={classes.cardIcon}>
								<PersonAddIcon />
							</Box>
							<Box>
								<Typography className={classes.statValue}>
									{counters.supportNew || 0}
								</Typography>
								<Typography className={classes.statLabel}>
									{i18n.t("dashboard.cards.newContacts")}
								</Typography>
							</Box>
						</Box>
						<Box
							className={clsx(classes.statChange, {
								[classes.positiveChange]: statsChange.newContacts > 0,
								[classes.negativeChange]: statsChange.newContacts < 0,
							})}
						>
							{statsChange.newContacts > 0 ? "↑" : "↓"}{" "}
							{Math.abs(statsChange.newContacts)}%{" "}
							{i18n.t("dashboard.cards.thisMonth")}
						</Box>
					</Paper>
				</Grid>

				{/* Average Talk Time */}
				<Grid item xs={12} sm={6} md={3}>
					<Paper elevation={0} className={classes.cardStats}>
						<Box className={classes.cardContent}>
							<Box className={classes.cardIcon}>
								<AccessTimeIcon />
							</Box>
							<Box>
								<Typography className={classes.statValue}>
									{counters.avgSupportTime || "0m"}
								</Typography>
								<Typography className={classes.statLabel}>
									{i18n.t("dashboard.cards.avgTalkTime")}
								</Typography>
							</Box>
						</Box>
						<Box
							className={clsx(classes.statChange, {
								[classes.positiveChange]: statsChange.avgTalkTime > 0,
								[classes.negativeChange]: statsChange.avgTalkTime < 0,
							})}
						>
							{statsChange.avgTalkTime > 0 ? "↑" : "↓"}{" "}
							{Math.abs(statsChange.avgTalkTime)}%{" "}
							{i18n.t("dashboard.cards.thisMonth")}
						</Box>
					</Paper>
				</Grid>

				{/* Average Wait Time */}
				<Grid item xs={12} sm={6} md={3}>
					<Paper elevation={0} className={classes.cardStats}>
						<Box className={classes.cardContent}>
							<Box className={classes.cardIcon}>
								<TimerIcon />
							</Box>
							<Box>
								<Typography className={classes.statValue}>
									{counters.avgWaitTime || "0m"}
								</Typography>
								<Typography className={classes.statLabel}>
									{i18n.t("dashboard.cards.avgWaitTime")}
								</Typography>
							</Box>
						</Box>
						<Box
							className={clsx(classes.statChange, {
								[classes.positiveChange]: statsChange.avgWaitTime > 0,
								[classes.negativeChange]: statsChange.avgWaitTime < 0,
							})}
						>
							{statsChange.avgWaitTime > 0 ? "↑" : "↓"}{" "}
							{Math.abs(statsChange.avgWaitTime)}%{" "}
							{i18n.t("dashboard.cards.thisMonth")}
						</Box>
					</Paper>
				</Grid>

				{/* Charts */}
				<Grid item xs={12} md={6}>
					<Paper elevation={0} className={classes.paper}>
						<ChartsDate
							dateStartTicket={dateStartTicket}
							dateEndTicket={dateEndTicket}
							setDateStartTicket={setDateStartTicket}
							setDateEndTicket={setDateEndTicket}
						/>
					</Paper>
				</Grid>

				<Grid item xs={12} md={6}>
					<Paper elevation={0} className={classes.paper}>
						<ChartsUser
							dateStartTicket={dateStartTicket}
							dateEndTicket={dateEndTicket}
							setDateStartTicket={setDateStartTicket}
							setDateEndTicket={setDateEndTicket}
						/>
					</Paper>
				</Grid>

				{/* Customers Table */}
				<Grid item xs={12}>
					<Paper elevation={0} className={classes.paper}>
						<Box className={classes.searchBox}>
							<Typography variant="h6">
								{i18n.t("dashboard.tables.customers.title")}
							</Typography>
							<TextField
								className={classes.searchInput}
								variant="outlined"
								size="small"
								placeholder={i18n.t("dashboard.tables.customers.search")}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<SearchIcon color="action" />
										</InputAdornment>
									),
								}}
							/>
						</Box>
						<Box className={classes.filterBox}>
							<FormControl variant="outlined" size="small">
								<Select
									value={period}
									onChange={(e) => setPeriod(e.target.value)}
								>
									<MenuItem value={0}>
										{i18n.t("dashboard.filters.period.all")}
									</MenuItem>
									<MenuItem value={3}>
										{i18n.t("dashboard.filters.period.last3months")}
									</MenuItem>
									<MenuItem value={6}>
										{i18n.t("dashboard.filters.period.last6months")}
									</MenuItem>
									<MenuItem value={12}>
										{i18n.t("dashboard.filters.period.lastYear")}
									</MenuItem>
								</Select>
							</FormControl>
						</Box>
						<Box className={classes.tableContainer}>
							<CustomerTable customers={mockCustomers} />
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</Container>
	);
};

export default Dashboard;
