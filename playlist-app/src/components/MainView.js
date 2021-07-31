import React, { useEffect, useState } from 'react';
import { Modal, Fab, Snackbar, Typography } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import AddIcon from '@material-ui/icons/Add';
import NewGenerator from './NewGenerator';
import GeneratorCard from './GeneratorCard';
import Search from './Search';
import Generator from '../Generator';

const MainView = ({
    hide,
    user,
    at,
    setError
}) => {
    const [showNew, setShowNew] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [generators, setGenerators] = useState(null);
    const [genToEdit, setGenToEdit] = useState(null);
	
	const fetchGenerators = async () => {
		try {
			fetch(`http://www.autoplaylistify.com/generator?user_id=${user.id}`)
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


    useEffect(() => {
        if (user) {
            fetchGenerators();
        }
    }, [user, setError]);

    const removeGenerator = (id) => setGenerators((generators) => generators.filter((g) => g.id !== id));

    const toggleModal = () => setShowNew((prev) => !prev);
    const generatorCards = generators ? generators.map((gen => <GeneratorCard
		generator={gen}
		at={at}
		setError={setError}
		removeGenerator={removeGenerator}
		edit={() => { setGenToEdit(gen); toggleModal();}} 
		/>))
		: null;
    const NewGen = React.forwardRef((props, ref) => <NewGenerator  {...props} ref={ref} />)
    if (hide) return null;
    return (
        <div className="Main">
            <div className="Main__activities">
                <Search /*filter gen cards by value here, pass onKeyUp*/ />
                <Fab color="primary" aria-label="add" onClick={toggleModal}>
                    <AddIcon/>
                </Fab>
            </div>
            <div className="Main__GeneratorCards">
                {generatorCards ? generatorCards : 
                    <div className="Main__noGenerators">
                        <Typography variant="h4" component="h2" color="textSecondary">
                        Click the plus icon to get started.
                        </Typography>
                    </div>}
            </div>
            <Snackbar open={showSuccess} autoHideDuration={6000} onClose={() => setShowSuccess(false)}>
                <MuiAlert elevation={6} variant="filled" onClose={() => setShowSuccess(false)} severity="success">
                        Your playlist generator has been saved
                </MuiAlert>
            </Snackbar>
            <Modal 
                open={showNew}
                onBackdropClick={toggleModal}
            >   
                <NewGen at={at} user={user} setError={setError} fetchGenerators={fetchGenerators} exisitingGenerator={genToEdit}
                closeSelf={
                    () => {
                        setShowNew(false);
                        setShowSuccess(true);
                        setGenToEdit(null);
                    }
                } />
            </Modal>
        </div>
    );
};

export default MainView;



/**
 remaining todos/ bugs
 - code including inheritance, polymorphism, and encapsulation
 - update deep equals on main activity
 - reauthentication on all auth endpoints
 * 
 */

