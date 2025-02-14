import React, { useState, useEffect } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Chip,
	Avatar,
	Box,
	IconButton,
	Menu,
	MenuItem,
	CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { i18n } from "../../translate/i18n";
import api from "../../services/api";

const useStyles = makeStyles((theme) => ({
	tableContainer: {
		borderRadius: theme.shape.borderRadius,
		backgroundColor: theme.palette.background.paper,
	},
	tableRow: {
		"&:hover": {
			backgroundColor: theme.palette.action.hover,
		},
	},
	statusChip: {
		borderRadius: theme.shape.borderRadius,
	},
	avatar: {
		width: 32,
		height: 32,
		marginRight: theme.spacing(1),
		backgroundColor: theme.palette.primary.main,
	},
	nameCell: {
		display: "flex",
		alignItems: "center",
	},
	activeChip: {
		backgroundColor: theme.palette.success.light,
		color: theme.palette.success.dark,
	},
	inactiveChip: {
		backgroundColor: theme.palette.error.light,
		color: theme.palette.error.dark,
	},
	loadingContainer: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		padding: theme.spacing(3),
	},
}));

const CustomerTable = () => {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedCustomer, setSelectedCustomer] = useState(null);
	const [customers, setCustomers] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchCustomers();
	}, []);

	const fetchCustomers = async () => {
		setLoading(true);
		try {
			const { data } = await api.get("/contacts");
			const formattedCustomers = data.map((contact) => ({
				id: contact.id,
				name: contact.name,
				company: contact.company || "N/A",
				phone: contact.number,
				email: contact.email || "N/A",
				country: "Brazil", // You might want to add this field to your contacts table
				status: contact.active ? "Active" : "Inactive",
			}));
			setCustomers(formattedCustomers);
		} catch (error) {
			console.error(error);
		}
		setLoading(false);
	};

	const handleMenuClick = (event, customer) => {
		setAnchorEl(event.currentTarget);
		setSelectedCustomer(customer);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		setSelectedCustomer(null);
	};

	const handleEdit = async () => {
		// Implement edit functionality
		handleMenuClose();
	};

	const handleDelete = async () => {
		if (!selectedCustomer) return;

		try {
			await api.delete(`/contacts/${selectedCustomer.id}`);
			await fetchCustomers();
		} catch (error) {
			console.error(error);
		}
		handleMenuClose();
	};

	const handleBlock = async () => {
		if (!selectedCustomer) return;

		try {
			await api.put(`/contacts/${selectedCustomer.id}`, {
				active: !selectedCustomer.status === "Active",
			});
			await fetchCustomers();
		} catch (error) {
			console.error(error);
		}
		handleMenuClose();
	};

	if (loading) {
		return (
			<Box className={classes.loadingContainer}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<TableContainer
			component={Paper}
			elevation={0}
			className={classes.tableContainer}
		>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>{i18n.t("customerTable.headers.name")}</TableCell>
						<TableCell>{i18n.t("customerTable.headers.company")}</TableCell>
						<TableCell>{i18n.t("customerTable.headers.phone")}</TableCell>
						<TableCell>{i18n.t("customerTable.headers.email")}</TableCell>
						<TableCell>{i18n.t("customerTable.headers.country")}</TableCell>
						<TableCell>{i18n.t("customerTable.headers.status")}</TableCell>
						<TableCell align="right">
							{i18n.t("customerTable.headers.actions")}
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{customers.map((customer) => (
						<TableRow key={customer.id} className={classes.tableRow}>
							<TableCell>
								<Box className={classes.nameCell}>
									<Avatar className={classes.avatar}>
										{customer.name.charAt(0)}
									</Avatar>
									{customer.name}
								</Box>
							</TableCell>
							<TableCell>{customer.company}</TableCell>
							<TableCell>{customer.phone}</TableCell>
							<TableCell>{customer.email}</TableCell>
							<TableCell>{customer.country}</TableCell>
							<TableCell>
								<Chip
									label={customer.status}
									className={`${classes.statusChip} ${
										customer.status === "Active"
											? classes.activeChip
											: classes.inactiveChip
									}`}
									size="small"
								/>
							</TableCell>
							<TableCell align="right">
								<IconButton
									size="small"
									onClick={(event) => handleMenuClick(event, customer)}
								>
									<MoreVertIcon />
								</IconButton>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<Menu
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleMenuClose}
			>
				<MenuItem onClick={handleEdit}>
					{i18n.t("customerTable.actions.edit")}
				</MenuItem>
				<MenuItem onClick={handleDelete}>
					{i18n.t("customerTable.actions.delete")}
				</MenuItem>
				<MenuItem onClick={handleBlock}>
					{i18n.t("customerTable.actions.block")}
				</MenuItem>
			</Menu>
		</TableContainer>
	);
};

export default CustomerTable;
