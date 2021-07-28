import React, { useState, useEffect }from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Generator from '../Generator';
import GeneratorCard from './GeneratorCard';

 const Discover = ({
	at,
	setError
 }) => {

	const [value, setValue] = useState(null);
	const [debounceId, setDebounceId] = useState(null);
	const [generators, setGenerators] = useState(null);

	const fetchGenerators = async () => {
		if (value.length === 0) {
			setError('Please add search query')
			return;
		}
		try {
			fetch(`http://localhost:8888/generator?query=${value}`)
			.then(response => response.json())
			.then(json => {
				if (json.error) {
					throw json.error;
				} else {
					const generators = [];
					for (const gen in json) {
						const g = new Generator({...json[gen], limit: json[gen].lim});
						if (!g.playlist) {
							g.run(at);
						}
						generators.push(g);
					}
					setGenerators(generators)
				}
			})
		} catch(e) {
			setError(e);
		}
	}

	const handleChange = (e) => {
        setValue(e.target.value);
    }

	const generatorCards = generators ? generators.map((gen => <GeneratorCard
		generator={gen}
		at={at}
		setError={setError}
		discover={true}
		/>))
		: null;
	return (
		<div className="Discover">
			<div className="Discover__field">
				<TextField fullWidth value={value} onChange={handleChange} label="Discover" />
				<Button variant="outlined" color="primary" onClick={fetchGenerators}>Search</Button>
			</div>
			<div className="Main__GeneratorCards">
				{generatorCards}
			</div>
		</div>
	)
}

export default Discover;