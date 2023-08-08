import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewProps } from 'react-native';
import colors from '../../../utils/theme/colors';
import { DateTimeHelper, s, st, vs } from '../../../utils';
import { DateTimeObjects } from '../../../services';
import Spacer from '../Spacer';
import { isIOS } from '../../../utils/constants/constants';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import SelectDropdown from 'react-native-select-dropdown';
import moment from 'moment';
import CustomTimeDropdown from './components/CustomTimeDropdown';
import { MarkedDates } from 'react-native-calendars/src/types';

LocaleConfig.locales['en'] = {
  formatAccessibilityLabel: "dddd d 'of' MMMM 'of' yyyy",
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  monthNamesShort: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  // numbers: ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'] // number localization example
};
LocaleConfig.defaultLocale = 'en';

export type CustomDateTimePickerProps = ViewProps & {
  pickerProps: DateTimeObjects;
  onConfirm?: (dateTime: Date, endDate?: Date) => any;
};

const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({
  pickerProps, onConfirm, ...restProps
}) => {
  //States
  const [date, setDate] = useState<Date | undefined>(
    pickerProps?.type === 'date_range'
    ? undefined
    : new Date()
  );
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [time, setTime] = useState<Date>(new Date());
  //Variables that uses multiple times
  const showPickDate = ['date', 'datetime', 'date_range'].includes(pickerProps?.type);
  const showPickTime = ['datetime', 'time'].includes(pickerProps?.type);
  const isDateRange = pickerProps?.type === 'date_range';
  const timeParts = DateTimeHelper.getHourByPeriod(time);

  //Functions
  const handleDateSelect = (day: DateData) => {
    const mDay = moment(day?.timestamp);
    const mStart = date ? moment(date) : undefined;
    const mEnd = endDate ? moment(endDate) : undefined;

    //Case 1: Pick 1 date only
    if (!isDateRange) { 
      setDate(new Date(day.timestamp));
      return;
    }
    // Case 2: Pick date range
    if (!date) {
      setDate(mDay.toDate());
    } else if(!endDate) {

      if (mDay.isSameOrBefore(mStart, 'd')) {
        setEndDate(mStart?.toDate());
        setDate(mDay.toDate());
      } else {
        setEndDate(mDay.toDate());
      }
    } else {
      if (mDay.isAfter(mEnd, 'd')) {
        setEndDate(mDay.toDate());
      } else if (mDay.isSame(mEnd, 'd')) {
        setEndDate(undefined);
      } else {
        setDate(mDay.toDate());
      }
    }
    
  }

  const handleConfirm = () => {
    const finalDate = date ? moment(date) : moment();
    if (time) {
      finalDate.hour(time.getHours());
      finalDate.minute(time.getMinutes());
      finalDate.second(time.getSeconds());
    }

    onConfirm?.(finalDate.toDate(), endDate);
  }

  const renderCommonTextGroup = (
    label: string,
    content: string | number = '',
    customPrefixContent?: React.ReactNode,
  ) => {
    return (
      <View style={styles.columnContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.row}>
          {customPrefixContent}
          <Text style={styles.description}>{content}</Text>
        </View>
      </View>
    );
  };

  const renderSelectedDate = () => {
    return (
      <View style={styles.rowContainer}>
        { showPickDate 
          ? renderCommonTextGroup(isDateRange ? 'Start Date' :'Selected Date',
            DateTimeHelper.formatDate(date, 'll') ?? '-'
          )
          : undefined
        }
        { showPickDate
          ? <Spacer width={10} />
          : undefined
        }
        {showPickTime
          ? renderCommonTextGroup('Selected Time', DateTimeHelper.formatDate(time, 'hh:mm A') ?? '-')
          : isDateRange
          ? renderCommonTextGroup('End Date',
            DateTimeHelper.formatDate(endDate, 'll') ?? '-'
          )
          : undefined
        }
      </View>
    );
  }

  const renderCalendar = () => {
    const mStart = date ? moment(date) : undefined;
    const mEnd = endDate ? moment(endDate) : undefined;

    var markedDates: MarkedDates = {}
    if (mStart) {
      if (isDateRange) {
        markedDates[mStart.format('YYYY-MM-DD')] = {
          startingDay: true,
          disableTouchEvent: false,
          endingDay: !mEnd || mStart?.isSame(mEnd, 'd'),
          color: colors.butterCup,
          textColor: colors.white,
        }
      } else {
        markedDates[mStart.format('YYYY-MM-DD')] = {
          selected: true,
          disableTouchEvent: false,
          selectedColor: colors.butterCup,
          selectedTextColor: colors.white,
          startingDay: true,
          endingDay: true,
          color: colors.butterCup,
          textColor: colors.white,
        }
      }
    }

    if (mEnd) {
      markedDates[mEnd.format('YYYY-MM-DD')] = {
        startingDay: mStart?.isSame(mEnd, 'd'),
        endingDay: true,
        color: colors.butterCup,
        textColor: colors.white,
      }
    }

    for (var m = moment(mStart).add(1, 'd'); mEnd && m?.isBefore(mEnd, 'd'); m?.add(1, 'd')) {
      markedDates[m.format('YYYY-MM-DD')] = {
        color: colors.earlyDawn,
        startingDay: false,
        endingDay: false,
      }
      
    }

    return (
      <View>
        <View style={styles.separator} />
        <Calendar
          theme={{
            arrowColor: colors.shark,
            textMonthFontWeight: 'bold',
            textMonthFontSize: st(12),
            monthTextColor: colors.shark,
            textDayHeaderFontWeight: 'bold',
            textDayHeaderFontSize: st(12),
            dayTextColor: colors.black,
            todayTextColor: colors.mountainMeadow,
          }}
          
          initialDate={ date ? DateTimeHelper.formatDate(date, 'YYYY-MM-DD') : undefined}
          onDayPress={day => {
            handleDateSelect(day);
          }}
          markedDates={markedDates}
          markingType={isDateRange ? 'period' : 'dot'}
          minDate={pickerProps?.['min-date']
            ? DateTimeHelper.formatDate(pickerProps?.['min-date'], 'YYYY-MM-DD')
            : undefined
          }
          maxDate={pickerProps?.['max-date']
            ? DateTimeHelper.formatDate(pickerProps?.['max-date'], 'YYYY-MM-DD')
            : undefined
          }
        />
      </View>
      
    );
  }

  const renderTimePicker = () => {
    const isPM = timeParts?.period === 'PM';
    return (
      <View>
        <View style={styles.separator} />
        <Text style={styles.subTitle}>Time</Text>
        <View style={styles.rowContainer}>
          <CustomTimeDropdown
            data={hours}
            defaultValue={timeParts?.hours}
            onSelect={(selectedItem, index) => {
              time.setHours(isPM ? selectedItem + 12 : selectedItem);
              setTime(new Date(time));
            }}
          />
          <CustomTimeDropdown
            data={minutes}
            defaultValue={timeParts?.minutes}
            onSelect={(selectedItem, index) => {
              time.setMinutes(selectedItem);
              setTime(new Date(time));
            }}
          />
          <CustomTimeDropdown
            data={timePeriod}
            defaultValue={timeParts?.period}
            onSelect={(selectedItem, index) => {
              time?.setHours(selectedItem === 'PM'
                ? timeParts?.hours + 12
                : timeParts?.hours
              );
              setTime(new Date(time));
            }}
          />
        </View>
       

      </View>
    )
  }

  const renderButton = () => {
    const isDisabled = isDateRange && (!date || !endDate); 
    // || showPickDate && !date || showPickTime && !time //=> never happen since `date` and `time` have initial value
    return (
      <TouchableOpacity
        disabled={isDisabled}
        style={[
          styles.button,
          isDisabled && {
            opacity: 0.6
          }
        ]}
        onPress={() => {
          handleConfirm?.()
        }}>
        <Text style={styles.buttonText}>{pickerProps?.['button-label'] ?? 'Confirm'}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View {...restProps}>
      {renderSelectedDate()}
      {showPickDate ? renderCalendar() : undefined}
      {showPickTime ? renderTimePicker() : undefined}
      <Spacer height={10} />
      {renderButton()}
      <Spacer height={16} />
    </View>
  );
}

export default CustomDateTimePicker;

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  columnContainer: {
    width: '50%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingBottom: s(6),
  },
  label: {
    fontWeight: isIOS ? '700' : 'bold',
    fontSize: s(12),
    color: colors.edward,
    letterSpacing: -0.02,
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  subTitle: {
    fontWeight: isIOS ? '600' : 'bold',
    fontSize: st(12),
    color: colors.shark,
    letterSpacing: -0.02,
    alignSelf: 'flex-start',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginVertical: vs(8),
  },
  description: {
    fontWeight: isIOS ? '700' : 'bold',
    fontSize: st(14),
    color: colors.shark,
    letterSpacing: -0.02,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: colors.blueBayoux20,
    marginVertical: vs(4),
  },
  button: {
    // flex: 1,
    minWidth: s(120),
    borderRadius: st(2),
    padding: st(10),
    backgroundColor: colors.mountainMeadow,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: st(16),
    color: colors.white,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

const hours = [...Array(12).keys()].map(it => it += 1); // start from 1 to 12
const minutes = [...Array(60).keys()];
const timePeriod = ['AM', 'PM'];