import React, { useState, useEffect }from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getContrastRatio, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

 const Reports = ({setError}) => {
	const [report, setReport] = useState(null);

	const useStyles = makeStyles({
		table: {
		  minWidth: 650,
		},
	  });
	const classes = useStyles();

	const getReports = async () => {
		try {
			const repo = await fetch('http://localhost:8888/report')
			.then((res) => res.json())
			.then((json) => {
				if (json.reportData) {
					let r = json.reportData;
					return r;
				}
			})
			return repo;
		} catch(e) {
    	console.error(e)
    	}
	}

	useEffect(() => {
		const getrr = async () => {
			const r = await getReports();
			console.log(r);
			setReport(r);
		}
		getrr();
	}, [setError])

	const buildReport = () => {
		if (report) {
			return (
				<TableContainer component={Paper}>
				<Table className={classes.table} aria-label="reports">
					<TableHead>
					<TableRow>
						<TableCell>Generator Name</TableCell>
						<TableCell align="right">Creator Name</TableCell>
						<TableCell align="right">Created/Modified Time</TableCell>
						<TableCell align="right">Seed Artists</TableCell>
						<TableCell align="right">Seed Genres</TableCell>
						<TableCell align="right">Seed tracks</TableCell>
					</TableRow>
					</TableHead>
					<TableBody>
					{Object.entries(report).map((row) => (
						<TableRow key={row.name + row.time}>
						<TableCell component="th" scope="row">
							{row.generatorName}
						</TableCell>
						<TableCell align="right">{row.name}</TableCell>
						<TableCell align="right">{row.time}</TableCell>
						<TableCell align="right">{JSON.parse(row.seed_artists).map((artist) => artist.name).toString()}</TableCell>
						<TableCell align="right">{JSON.parse(row.seed_genres).toString()}</TableCell>
						<TableCell align="right">{JSON.parse(row.seed_tracks).map((artist) => artist.name).toString()}</TableCell>
						</TableRow>
					))}
					</TableBody>
				</Table>
				</TableContainer>
			);
		}
		return null;
	}

	const renderedReport =  buildReport();
	return (
		<div className="Discover">
			{report ? renderedReport : (
				<div>
					<CircularProgress color="primary" />
				</div>
			) }
		</div>
	)
}

export default Reports;