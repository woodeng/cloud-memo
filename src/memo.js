import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import InputBase from "@material-ui/core/InputBase";
import ip from "./ip.json";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginBottom: 5,
    border: "1px solid rgba(0, 0, 0, .125)",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(10),
    color: theme.palette.text.secondary,
    alignSelf: "center",
  },
}));

export default function ControlledExpansionPanels(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(
    props.title === "" && props.contents === "" ? true : false
  );
  const [editMode, setEditMode] = React.useState(
    props.title === "" && props.contents === "" ? true : false
  );
  const [title, setTitle] = React.useState(props ? props.title : null);
  const [contents, setContents] = React.useState(props ? props.contents : null);
  const [date, setDate] = React.useState(props ? props.date : null);
  const _id = props ? props._id : null;
  const isImage = props ? props.isImage : false;

  const [imageClicked, setImageClicked] = React.useState(false);

  const [file, setFile] = React.useState();
  const [fileType, setfileType] = React.useState(props ? props.fileType : null);
  const [fileName, setFileName] = React.useState(props.fileName);

  const toggleEdit = () => {
    setEditMode(!editMode);
  };
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const toggleImage = () => {
    setImageClicked(!imageClicked);
  };

  //수정 완료 버튼을 눌렀을 때
  const onPressSubmit = () => {
    updateApiCall();
    toggleEdit();
  };

  const updateApiCall = () => {
    axios
      .post(`http://${ip.ip}/api/memos/update`, null, {
        params: { _id: _id, title: title, contents: contents },
      })
      .then((res) => {
        setDate(date);
        props.refresh();
      });
  };

  const deleteApiCall = () => {
    axios
      .delete(`http://${ip.ip}/api/memos/delete`, {
        params: { _id: _id },
      })
      .then((res) => {
        //console.log(res.data);
        props.refresh();
      });
  };

  const onPressDelete = () => {
    //modal같은걸 띄워서 삭제할 지 물어보는 게 좋을 듯
    deleteApiCall();
  };

  const onPressFileDelete = () => {
    console.log("파일 삭제");
    fileRemove();
  };

  const fileRemove = () => {
    axios
      .post(`http://${ip.ip}/api/memos/remove`, null, {
        params: { _id: _id },
      })
      .then((res) => {
        props.refresh();
      });
  };

  const uploadFile = () => {
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    //console.log(...data);
    setFileName(file.name);
    axios({
      method: "post",
      url: `http://${ip.ip}/api/memos/upload`,
      data,
      params: { _id: _id },
      headers: { "Content-Type": "multipart/form-data" },
    }).then((res) => {
      console.log(res);
      props.refresh();
    });
  };

  const handleFileInput = (e) => {
    setFile(e.target.files[0]);
  };

  const toBase64 = (arr) => {
    return btoa(
      arr.reduce((data, byte) => data + String.fromCharCode(byte), "")
    );
  };

  useEffect(() => {}, []);

  return (
    <div className={classes.root}>
      <ExpansionPanel expanded={expanded} onChange={toggleExpand} square={true}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          {!editMode ? (
            <Box
              style={{ width: "100%", paddingTop: 6 }}
              display="flex"
              justifyContent="space-between"
            >
              <Typography className={classes.heading}>{title}</Typography>
              <Typography className={classes.secondaryHeading}>
                {date}
              </Typography>
            </Box>
          ) : (
            <FormControlLabel
              onClick={(event) => event.stopPropagation()}
              onFocus={(event) => event.stopPropagation()}
              control={
                <InputBase
                  placeholder={"제목을 입력하세요"}
                  autoFocus={true}
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  style={{
                    fontSize: 15,
                    paddingLeft: 11,
                    width: "100%",
                  }}
                />
              }
              label=""
              style={{ width: "100%" }}
            />
          )}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {!editMode ? (
            <Typography
              variant="body2"
              style={{
                marginTop: 9,
                marginBottom: 4,
                whiteSpace: "pre-line",
              }}
            >
              {contents}
            </Typography>
          ) : (
            <InputBase
              placeholder={"내용을 입력하세요"}
              style={{ fontSize: 14, paddingBottom: 4, lineHeight: 1.5 }}
              fullWidth={true}
              multiline={true}
              onChange={(e) => setContents(e.target.value)}
              value={contents}
            />
          )}
        </ExpansionPanelDetails>
        <Divider />
        <Typography style={{ paddingLeft: 30 }} variant="caption">
          첨부파일
        </Typography>
        {!editMode ? (
          <ExpansionPanelDetails>
            {props.file ? (
              isImage ? (
                <img
                  style={{
                    maxWidth: !imageClicked ? "auto" : "auto",
                    maxHeight: !imageClicked ? 100 : 300,
                  }}
                  onClick={toggleImage}
                  src={`data:image/${fileType.slice(6)};base64,${toBase64(
                    props.file.data
                  )}`}
                />
              ) : (
                <a
                  href={`data:file/plane;base64,${toBase64(props.file.data)}`}
                  download={fileName}
                >
                  {fileName}
                </a>
              )
            ) : null}
          </ExpansionPanelDetails>
        ) : (
          <ExpansionPanelDetails>
            {props.file ? (
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
              >
                <div style={{ alignSelf: "center" }}>{fileName}</div>
                <Button
                  style={{ marginLeft: 10, alignSelf: "center" }}
                  size="small"
                  onClick={onPressFileDelete}
                  variant="outlined"
                  color="secondary"
                >
                  파일 삭제
                </Button>
              </Box>
            ) : (
              <Box>
                <input
                  type="file"
                  onChange={(e) => handleFileInput(e)}
                  multiple
                />
                <Button
                  style={{ alignSelf: "flex-end" }}
                  color="primary"
                  onClick={uploadFile}
                >
                  업로드
                </Button>
              </Box>
            )}
          </ExpansionPanelDetails>
        )}
        <Divider />
        <ExpansionPanelActions>
          {!editMode ? (
            <Box>
              <Button size="small" color="primary" onClick={toggleEdit}>
                수정
              </Button>
              <Button size="small" color="secondary" onClick={onPressDelete}>
                삭제
              </Button>
            </Box>
          ) : (
            <Box>
              <Button
                style={{ paddingBottom: 5 }}
                size="small"
                color="primary"
                onClick={(e) => onPressSubmit(e)}
              >
                완료
              </Button>
            </Box>
          )}
        </ExpansionPanelActions>
      </ExpansionPanel>
    </div>
  );
}
