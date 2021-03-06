import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, Stack, alpha, Box } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import CBtn from '../Commons/CBtn';
import Chip from '@mui/material/Chip';
import { customAxios } from '../../Lib/customAxios';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../Redux/accountReducer';
import alpaca from '../../Assets/Img/alpaca.png';
import { isMobile } from 'react-device-detect';
import CInput from '../Commons/CInput';
import CProfile from '../Commons/CProfile';
import { Close, Search } from '@mui/icons-material';
import CInputWithBtn from '../Commons/CInputWithBtn';
import useAlert from '../../Hooks/useAlert';

export interface StudyCreateProps {
  open: boolean;
  onClose: () => void;
  page: number;
  studyList: any;
  callback: Function;
}

interface Member {
  id: number;
  nickname: string;
  profileImg?: string;
}

const SearchResultBox = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.component,
  position: 'relative',
  height: '20vh',
}));

const CDialogTitle = styled(DialogTitle)(({ theme }) => ({
  padding: theme.spacing(2),
  fontSize: isMobile ? 12 : '',
  backgroundColor: theme.palette.accent,
  color: theme.palette.icon,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const CustomContent = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.bg,
  color: theme.palette.txt,
  padding: theme.spacing(3),
  minWidth: isMobile ? 300 : 450,
}));

const MemberArray = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'left',
  // flexWrap: 'wrap',
  overflowX: 'scroll',
  listStyle: 'none',
  padding: 0.5,
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  height: theme.spacing(8),
}));

const ListChip = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const CChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.main,
  color: theme.palette.txt,
}));

function StudyCreate(props: StudyCreateProps) {
  const { onClose, open } = props;

  const dispatch = useDispatch();
  const theme = useTheme();
  const userInfo = useSelector((state: any) => state.account);
  const cAlert = useAlert();

  const [studyname, setStudyName] = useState('');
  const [studyintro, setStudyIntro] = useState('');
  const [memberList, setMemberList] = useState<Member[]>([]);
  const [getUser, setgetUser] = useState<Member[]>([]);
  const [nameMessage, setNameMessage] = useState<string>('');
  const [introMessage, setIntroMessage] = useState<string>('');
  const [searchNickname, setSearchNickname] = useState<string>('');

  const nameRegex = /^.{0,50}$/;
  const introRegex = /^.{0,500}$/;

  useEffect(() => {
    if (nameRegex.test(studyname)) {
      setNameMessage('');
    } else {
      setNameMessage('50??? ????????? ???????????????.');
    }
  }, [studyname]);

  useEffect(() => {
    if (introRegex.test(studyintro)) {
      setIntroMessage('');
    } else {
      setIntroMessage('500??? ????????? ???????????????.');
    }
  }, [studyintro]);

  useEffect(() => {
    setMemberList([]);
    setgetUser([]);
  }, [open]);

  useEffect(() => {
    userSearch();
  }, [searchNickname]);

  const handleClose = () => {
    createData();
  };

  const cancleClose = () => {
    setStudyName('');
    setStudyIntro('');
    setMemberList([]);
    onClose();
  };
  const handleDelete = (chipToDelete: Member) => () => {
    if (userInfo.userId !== chipToDelete.id)
      setMemberList((chips) => chips.filter((chip) => chip.id !== chipToDelete.id));
  };

  const createData = async () => {
    if (!studyname) {
      setNameMessage('????????? ????????? ??????????????????.');
      return;
    }
    if (!studyintro) {
      setIntroMessage('????????? ????????? ??????????????????.');
      return;
    }
    const sendList = memberList.map((data) => data.id);
    try {
      const res = await customAxios({
        method: 'post',
        url: `/study`,
        data: {
          info: studyintro,
          memberIdList: sendList,
          title: studyname,
        },
      });
      const resUserInfo = { ...userInfo };
      resUserInfo.studies = [...resUserInfo.studies, res.data];
      dispatch(setUserInfo(resUserInfo));
      const page = Math.ceil(resUserInfo.studies.length / 3);
      props.callback(page, resUserInfo.studies);
      cAlert.fire({
        title: '?????? ??????!!',
        text: '????????? ????????? ??????????????????!',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
      onClose();
      setStudyName('');
      setStudyIntro('');
      setMemberList([]);
    } catch (e: any) {
      cAlert.fire({
        title: '?????? ??????!',
        text: e.response.data.message || '?????? ??? ?????? ??????????????????.',
        icon: 'error',
        showConfirmButton: false,
        timer: 1500,
      });
      // console.log(e.response);
    }
  };

  const userSearch = async () => {
    if (!searchNickname) return;

    try {
      const res = await customAxios({
        method: 'get',
        url: `/user/search`,
        params: { nickname: searchNickname },
      });
      setgetUser(res.data);
      // console.log('getUserList: ', res);
    } catch (e: any) {
      // console.log(e.response);
    }
  };

  return (
    <Dialog onClose={cancleClose} open={open} fullScreen={isMobile}>
      <CDialogTitle>
        <div style={{ fontSize: 24, fontWeight: 'bold' }}>????????? ??????</div>
        <Close onClick={cancleClose} />
      </CDialogTitle>
      <CustomContent>
        <CInput label="????????? ??????" onChange={setStudyName} helperText={nameMessage} multiline />
        <CInput label="????????? ??????" onChange={setStudyIntro} helperText={introMessage} multiline />
        <CInputWithBtn
          label="???????????? ??????"
          onChange={setSearchNickname}
          buttonBackgroundColor="rgba(0,0,0,0)"
          buttonContent={<Search />}
          onButtonClick={() => {}}
        />

        <SearchResultBox className="scroll-box">
          {getUser.map((item: Member, idx: number) => {
            return (
              <Box
                sx={{
                  py: 1,
                  backgroundColor:
                    idx % 2 ? alpha(theme.palette.bg, 0.3) : alpha(theme.palette.main, 0.3),
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: 'fit-content',
                }}
                key={`search-result-${idx}`}
                onClick={() => {
                  setMemberList((prev) => {
                    if (
                      !prev.some((samedata) => {
                        return samedata.id === item.id;
                      })
                    )
                      return [...prev, item];
                    else return [...prev];
                  });
                }}>
                <CProfile nickname={item.nickname} profileImg={item.profileImg} />
              </Box>
            );
          })}
        </SearchResultBox>
        <MemberArray>
          <ListChip>
            <CChip
              avatar={<Avatar src={userInfo.profileImg ? userInfo.profileImg : alpaca} />}
              label={userInfo.nickname}
            />
          </ListChip>

          {memberList.map((data: Member, idx: number) => {
            return (
              <ListChip key={`added-member-${idx}`}>
                <CChip
                  avatar={<Avatar src={!!data.profileImg ? data.profileImg : alpaca} />}
                  label={data.nickname}
                  onDelete={handleDelete(data)}
                />
              </ListChip>
            );
          })}
        </MemberArray>
        <Grid item sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <CBtn content="??????" onClick={cancleClose} width="30%" height="100%"></CBtn>
          <CBtn
            content="??????"
            onClick={handleClose}
            width="30%"
            height="100%"
            disabled={!!nameMessage || !!introMessage}></CBtn>
        </Grid>
      </CustomContent>
    </Dialog>
  );
}

export default StudyCreate;
