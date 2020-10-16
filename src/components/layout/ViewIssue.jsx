import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import issueService from '../../services/issueService'
import '../../App.css'
import moment from 'moment'
import CssBaseline from '@material-ui/core/CssBaseline'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import InputLabel from '@material-ui/core/InputLabel'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import SaveIcon from '@material-ui/icons/Save'
import Avatar from '@material-ui/core/Avatar'
import MenuItem from '@material-ui/core/MenuItem'
import { deepPurple } from '@material-ui/core/colors'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import { Link } from 'react-router-dom'
import EditIcon from '@material-ui/icons/Edit'
import { useHistory } from 'react-router-dom'
import auth from '../auth/auth-helper'

const drawerWidth = 240

const formattedDate = (value) => moment(value).format('DD/MM-YYYY')

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  button: {
    margin: theme.spacing(1),
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingTop: '50px'
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '100%',
    backgroundColor: 'white',
  },
  textFieldStatus: {
    margin: theme.spacing(1),
    width: '10%',
    backgroundColor: 'white',
    marginTop: '0',
  },
  avatar: {
    margin: 10,
  },
  purpleAvatar: {
    margin: 0,
    left: 0,
    width: '70px',
    height: '70px',
    color: '#fff',
    backgroundColor: deepPurple[500]
  }
}))

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16,
  textAlign: 'left'
}

const thumb = {
  display: 'inline-flex',
  position: 'relative',
  borderRadius: 2,
  border: '3px solid #eaeaea',
  marginBottom: 8,
  marginRight: 4,
  width: 150,
  height: 150,
  padding: 4,
  boxSizing: 'border-box',
  margin: '0 auto'
}

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
}

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
}

export default function ViewIssue (props) {
  const classes = useStyles()
  const [dataset, setData] = useState([''])
  const [images, setImages] = useState([])
  const [errors, setErrors] = useState('')
  const [myself, setMyself] = useState([])

  const [selectedDate, setSelectedDate] = React.useState(dataset.updatedAt)
  const history = useHistory();

  const goHome = () => {
    history.push("/saker/" + auth.isAuthenticated().user._id);
  }

  const handleChange = (event) => {
    setData(event.target.value)
  }

  const handleDataChange = (name) => (event) => {
    setData({
      ...dataset,
      [name]: event.target.value
    })
    console.log("event handle change: ", event.target.value + " " + myself.role)
    updateIssueByID(id, event.target.value, myself.role)
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  const { id } = props.match.params

  useEffect(() => {
    getIssueByID(id)
  }, [id])

  const getIssueByID = async (id) => {
    const res = await issueService.getIssueByID(id)
    setData(res)
    if (res.imageName === null) {
      setImages(['none'])
    } else {
      setImages(res.imageName[0])
    }
  }

  const updateIssueByID = async (id, data) => {
    await issueService.updateIssueByID(id, {"status": data})
    .then(response => {
      setData({ ...dataset, status: data });
      console.log("ISSUE UPDATE RESPONSE: ", response);
    })
    .catch(e => {
      console.log("ISSUE UPDATE: ", e);
    });
  }

  const Status = [
  {
    value: 0,
    label: 'Åpen'
  },
  {
    value: 1,
    label: 'Løst'
  },
  {
    value: 2,
    label: 'Lukket'
  }
]

  const thumbs = images.map((file, index) => (
    <div style={thumb} key={index}>
      <div style={thumbInner}>
        <DeleteForeverRoundedIcon className={classes.icon} />
        <img alt={file.name} src={file.path} style={img} />
      </div>
    </div>
  ))

  useEffect(
    () => {
      // Make sure to revoke the data uris to avoid memory leaks
      images.forEach((file) => URL.revokeObjectURL(file.path))
    },
    [images] // files
  )

  const imgList = images.map((file, index) => {
    if (file === 'none') {
      return <div key={index}>Ingen vedlegg</div>
    }
    return (
      <div style={{ display: 'grid', margin: '1em' }} key={index}>
        <Link
          to={process.env.PUBLIC_URL + '/uploads/' + file.path}
          target="_blank"
          download
        >
          <img
            key={index}
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '0.5em'
            }}
            src={process.env.PUBLIC_URL + '/uploads/' + file.path}
          ></img>
        </Link>
        <div
          style={{
            display: 'inline-flex',
            margin: '1em',
            height: '40px'
          }}
        >
          <Link
            to={process.env.PUBLIC_URL + '/uploads/' + file.path}
            target="_blank"
            download
          >
            <Button variant="contained" color="default" startIcon={<SaveIcon />}>
              Download
            </Button>
          </Link>
        </div>
      </div>
    )
  })

  return (
    <div className={classes.root}>
      <CssBaseline />
      <nav className={classes.drawer} aria-label="Mailbox folders" />
      <main className={classes.content}>
        <Typography variant="h4" gutterBottom></Typography>
        <div className="grid-container">
          <div className="item0">
            <IconButton
              onClick={goHome}
            >
              <ArrowBackIcon />
            </IconButton>
          </div>
          <div className="item1" style={{ paddingLeft: '5rem' }}>
            {dataset.name}
            <p style={{ fontSize: '0.6em', marginTop: '0.3em' }}>
              Opprettet: {formattedDate(dataset.createdAt)}
            </p>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<EditIcon />}
              size="small"
            >
              Rediger
            </Button>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              startIcon={<DeleteIcon />}
              size="small"
            >
              Slett sak
            </Button>
          <TextField
            id="outlined-select-status"
            select
            label="Status"
            name="Status"
            size="small"
            className={classes.textFieldStatus}
            value={[dataset.status ? dataset.status : 'Åpen']}
            onChange={handleDataChange('status')}
            InputProps={{
              className: classes.input
            }}
            SelectProps={{
              MenuProps: {
                className: classes.menu
              }
            }}
            margin="normal"
            variant="outlined"
          >
            {Status.map((option, key) => (
              <MenuItem key={key} value={option.label}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          {errors.status ? (
            <Box
              className={classes.BoxErrorField}
              fontFamily="Monospace"
              color="error.main"
              p={1}
              m={1}
            >
              {errors.status}
              {' '}
              ⚠️
            </Box>
          ) : (
            ''
          )}

          </div>
          <div className="item2">
            <TextField
              label="Priority"
              value={[dataset.priority ? dataset.priority: '']}
              className={classes.textField}
              margin="normal"
              variant="outlined"
              onChange={handleChange}
              InputProps={{
                readOnly: true
              }}
            />
          </div>
          <div className="item3">
            <TextField
              label="Sist oppdatert"
              value={formattedDate(dataset.updatedAt)}
              className={classes.textField}
              margin="normal"
              variant="outlined"
              onChange={handleChange}
              InputProps={{
                readOnly: true
              }}
            />
          </div>
          <div className="item14">
            <InputLabel shrink htmlFor="select-multiple-native">
              Vedlegg
            </InputLabel>
            <aside style={thumbsContainer}>{imgList}</aside>
          </div>
          <div className="item4">
            <TextField
              label="Kategori"
              value={[dataset.category ? dataset.category : '']}
              className={classes.textField}
              margin="normal"
              variant="outlined"
              InputProps={{
                readOnly: true
              }}
            />
          </div>
          <div className="item1">
            <Grid container alignItems="flex-start">
              <Avatar
                alt="Profile picture"
                className={classes.purpleAvatar}
              ></Avatar>
            </Grid>
          </div>
          <div className="item7">
            <TextField
              label="Alvorlighetsgrad"
              value={[dataset.severity ? dataset.severity : '']}
              className={classes.textField}
              margin="normal"
              variant="outlined"
              InputProps={{
                readOnly: true
              }}
            />
          </div>
          <div className="item8">
            <TextField
              label="Mulighet å reprodusere"
              value={[dataset.reproduce ? dataset.reproduce : '']}
              className={classes.textField}
              margin="normal"
              variant="outlined"
              InputProps={{
                readOnly: true
              }}
            />
          </div>
          <div className="item15">
            <TextField
              label="Delegert til"
              value={[dataset.delegated ? dataset.delegated : 'Ingen']}
              className={classes.textField}
              margin="normal"
              variant="outlined"
              InputProps={{
                readOnly: true
              }}
            />
          </div>
          <div className="item11">
            <TextField
              multiline
              label="Oppsummering"
              value={[dataset.summary ? dataset.summary : '']}
              className={classes.textField}
              margin="normal"
              variant="outlined"
              InputProps={{
                readOnly: true
              }}
            />
          </div>
          <div className="item12">
            <TextField
              multiline
              rowsMax="8"
              variant="outlined"
              label="Beskrivelse"
              value={[dataset.description ? dataset.description : '']}
              className={classes.textField}
              margin="normal"
              InputProps={{
                readOnly: true
              }}
            />
          </div>
          <div className="item13">
            <TextField
              multiline
              variant="outlined"
              rows="10"
              label="Steg for å reprodusere"
              value={[dataset.step_reproduce ? dataset.step_reproduce : '']}
              className={classes.textField}
              margin="normal"
              InputProps={{
                readOnly: true
              }}
            />
          </div>
          <div className="item10">
            <TextField
              multiline
              rows="10"
              variant="outlined"
              label="Tilleggsinformasjon"
              value={[dataset.additional_info ? dataset.additional_info : '']}
              className={classes.textField}
              margin="normal"
              InputProps={{
                readOnly: true
              }}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
