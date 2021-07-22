import { Typography, Tooltip, Slider, Button} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const MaterialSlider = ({ 
    marks,
    step,
    title,
    description,
    value,
    getAriaValueText, 
    onChange,
    valueLabelDisplay,
    valueLabelFormat,
    min,
    max,
    required
}) => {
  const useStyles = makeStyles({
    root: {
      width: 650,
      paddingTop: 20
    },
    title: {
      display: 'flex',
      flexDirection: 'row'
    },
    right: {
      paddingTop: 3.5,
      paddingRight: 10
    }

  });
  const classes = useStyles();
  return (
    <div className={classes.root} >
      <div className={classes.title}>
        <Tooltip title={description}>
          <Typography className={classes.right} id="range-slider" color="textPrimary" >
              {title}
          </Typography>
        </Tooltip>
        { !required && value[0] !== null &&
          <Button
          variant="contained"
          color="primary"
          size='small'
          onClick={() => onChange(null, [null, null])}
          >
              clear
          </Button>
        }
      </div>
      <Slider
        value={value}
        aria-labelledby="range-slider"
        getAriaValueText={getAriaValueText}
        marks={marks}
        step={step}
        onChange={onChange}
        valueLabelDisplay={valueLabelDisplay}
        valueLabelFormat={valueLabelFormat}
        min={min}
        max={max}
      />
    </div>
);}

export default MaterialSlider;