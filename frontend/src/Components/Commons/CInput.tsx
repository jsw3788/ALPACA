import { FormControl, FormHelperText, Grid, Input, styled } from '@mui/material';
import React from 'react';
import { BrowserView, MobileView } from 'react-device-detect';

interface CInputProps {
  label: string;
  multiline?: boolean;
  placeholder?: string;
  type?: string;
  helperText?: string;
  value?: string;
  readOnly?: boolean;
  onChange: React.Dispatch<React.SetStateAction<string>>;
}

const CustomGridContainer = styled(Grid)(({ theme }) => ({
  color: theme.palette.txt,
  height: 80,
}));

const CustomInput = styled(Input)(({ theme }) => ({
  color: theme.palette.txt,
  '&:before': { borderBottom: `1px solid ${theme.palette.txt}` },
  '&:after': {
    borderBottom: `2px solid ${theme.palette.accent}`,
  },
}));

function CInput({
  label,
  value,
  placeholder = '',
  multiline = false,
  type = 'text',
  helperText = '',
  readOnly = false,
  onChange,
}: CInputProps) {
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <>
      <BrowserView>
        <CustomGridContainer container>
          <Grid item xs={4} sx={{ paddingTop: 1, display: 'flex', justifyContent: 'center' }}>
            <label htmlFor={`${label}-label`}>{label}</label>
          </Grid>
          <Grid item xs={8}>
            <FormControl variant="standard" error={!!helperText} fullWidth>
              <CustomInput
                id={`${label}-label`}
                onChange={onChangeHandler}
                type={type}
                value={value}
                placeholder={placeholder}
                fullWidth
                readOnly={readOnly}
                autoComplete={label}
              />
              <FormHelperText>{helperText}</FormHelperText>
            </FormControl>
          </Grid>
        </CustomGridContainer>
      </BrowserView>
      <MobileView>
        <CustomGridContainer container>
          <Grid item xs={12} sx={{ paddingTop: 1, display: 'flex', justifyContent: 'left' }}>
            <label htmlFor={`${label}-label`}>{label}</label>
          </Grid>
          <Grid item xs={12}>
            <FormControl variant="standard" error={!!helperText} fullWidth>
              <CustomInput
                id={`${label}-label`}
                onChange={onChangeHandler}
                type={type}
                value={value}
                placeholder={placeholder}
                fullWidth
                readOnly={readOnly}
                multiline={multiline}
                autoComplete={label}
              />
              <FormHelperText>{helperText}</FormHelperText>
            </FormControl>
          </Grid>
        </CustomGridContainer>
      </MobileView>
    </>
  );
}

export default CInput;
