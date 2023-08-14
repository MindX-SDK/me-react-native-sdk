import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewProps } from 'react-native';
import colors from '../../../utils/theme/colors';
import { DateTimeHelper, s, st, vs } from '../../../utils';
import { DateTimeObjects } from '../../../services';
import Spacer from '../Spacer';
import { isIOS } from '../../../utils/constants/constants';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import CustomTimeDropdown from './components/CustomTimeDropdown';
import { MarkedDates } from 'react-native-calendars/src/types';
import { TxKeyPath, translate } from '../../../i18n';

export type CustomDateTimePickerProps = ViewProps & {
  pickerProps: DateTimeObjects;
  onConfirm?: (dateTime: Date, endDate?: Date) => any;
};

const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({
  pickerProps, onConfirm, ...restProps
}) => {
  const todayMoment = moment();
  const minDateMoment = DateTimeHelper.toMoment(pickerProps?.['min-date']);
  const maxDateMoment = DateTimeHelper.toMoment(pickerProps?.['max-date']);
  //States
  const [date, setDate] = useState<Date | undefined>(
    // pickerProps?.type === 'date_range' || 
    //   (pickerProps?.['date-limit-type'] === 'future_only' &&
    //   !pickerProps?.['include-current-date']) || 
    //     (pickerProps?.['date-limit-type'] === 'limited' &&
    //     !DateTimeHelper.isBetween(new Date(), minDateMoment?.toDate(), maxDateMoment?.toDate()))
    //   ? undefined
    //   : new Date()
  );
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [time, setTime] = useState<Date>(
    moment().set({hour: 1, minute: 0, second: 0, millisecond: 0}).toDate()
    );
  //Variables that uses multiple times
  const showPickDate = ['date', 'datetime', 'date_range'].includes(pickerProps?.type);
  const showPickTime = ['datetime', 'time'].includes(pickerProps?.type);
  const isDateRange = pickerProps?.type === 'date_range';
  const timeParts = DateTimeHelper.getHourByPeriod(time);
  const locale = pickerProps?.language;
  
  //Effects
  useEffect(() => {
    //Update minutes to nearest minutes in selection
    time.setMinutes(minutes?.find(it => it >= timeParts?.minutes) ?? 0)
    setTime(new Date(time))
  }, [])

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
    } else if (!endDate) {
      if (mDay.isSameOrBefore(mStart, 'd')) {
        setEndDate(mStart?.toDate());
        setDate(mDay.toDate());
      } else {
        setEndDate(mDay.toDate());
      }
    } else {
      if (mDay.isSame(mStart, 'd')) {
        setDate(undefined);
        setEndDate(undefined);
      } else if (mDay.isSame(mEnd, 'd')) {
        setDate(mDay.toDate());
        setEndDate(undefined);
      } else if (mDay.isAfter(mStart, 'd')) {
        setEndDate(mDay.toDate());
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
        {showPickDate
          ? renderCommonTextGroup(
            translate(isDateRange ? 'start_date' : 'selected_date', undefined, locale),
            date
              ? DateTimeHelper.formatMindXDatetime(
                date,
                undefined,
                pickerProps,
                { isDateOnly: true }
              ) ?? '-'
              : '-'
          )
          : undefined
        }
        {showPickDate
          ? <Spacer width={10} />
          : undefined
        }
        {showPickTime
          ? renderCommonTextGroup(
            translate('selected_time', undefined, locale),
            time
              ? translate(
                `time_${DateTimeHelper.formatDate(time, 'A') ?? ''}` as TxKeyPath,
                {time: (DateTimeHelper.formatDate(time, 'hh:mm ') ?? '')},
                locale,
              )
              : '_'
          )
          : isDateRange
            ? renderCommonTextGroup(
              translate('end_date', undefined, locale),
              endDate
                ? DateTimeHelper.formatMindXDatetime(
                  endDate,
                  undefined,
                  pickerProps,
                  { isDateOnly: true }
                ) ?? '-'
                : '-'
            )
            : undefined
        }
      </View>
    );
  }

  const renderCalendar = () => {
    //Language
    const calendarLang = locale ? locale : 'en';
    if (calendarLang) {
      LocaleConfig.locales[calendarLang] = translate(
        'calendar_format',
        undefined,
        calendarLang
      );
      LocaleConfig.defaultLocale = calendarLang;
    }
    //Start/end dates
    const mStart = date ? moment(date) : undefined;
    const mEnd = endDate ? moment(endDate) : undefined;

    //Date selection limit
    const mToday = moment();
    const minDateStr =
      pickerProps?.['date-limit-type'] === 'future_only'
        ? DateTimeHelper.formatDate(
          pickerProps?.['include-current-date'] ? mToday.toDate() : mToday.add(1, 'd').toDate(),
          'YYYY-MM-DD'
        )
        : pickerProps?.['date-limit-type'] === 'limited' && pickerProps?.['min-date']
          ? minDateMoment?.format('YYYY-MM-DD')
          : undefined;
    const maxDateStr = pickerProps?.['date-limit-type'] === 'limited' && pickerProps?.['max-date']
      ? maxDateMoment?.format('YYYY-MM-DD')
      : undefined;


    //Marking renders
    var markedDates: MarkedDates = {}
    if (mStart) {
      if (isDateRange) {
        markedDates[mStart.format('YYYY-MM-DD')] = {
          startingDay: false,
          endingDay: false,// !mEnd || mStart?.isSame(mEnd, 'd'),
          selected: true,
          disableTouchEvent: false,
          color: colors.earlyDawn,
          textColor: colors.white,
          customContainerStyle: {
            borderRadius: st(20),
            width: st(36),
            height: st(36),
            backgroundColor: colors.butterCup,
            marginRight: st(isIOS ? 4 : 6.8),
          },
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
        startingDay: false, // mStart?.isSame(mEnd, 'd'),
        endingDay: false,
        selected: true,
        disableTouchEvent: false,
        color: colors.earlyDawn,
        textColor: colors.white,
        customContainerStyle: {
          borderRadius: st(20),
          width: st(36),
          height: st(36),
          backgroundColor: colors.butterCup,
        }
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
          key={`calendar-${locale}`}
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
          initialDate={date ? DateTimeHelper.formatDate(date, 'YYYY-MM-DD') : undefined}
          onDayPress={day => {
            handleDateSelect(day);
          }}
          markedDates={markedDates}
          markingType={isDateRange ? 'period' : 'dot'}
          minDate={minDateStr}
          maxDate={maxDateStr}
          hideArrows={minDateMoment?.isSame(todayMoment, 'month') &&
            maxDateMoment?.isSame(todayMoment, 'month')
          }
        />
      </View>

    );
  }

  const renderTimePicker = () => {
    const isPM = timeParts?.period === 'PM';
    console.log(timeParts)
    return (
      <View>
        <View style={styles.separator} />
        <Text style={styles.subTitle}>{translate('time', undefined, locale)}</Text>
        <View style={styles.rowContainer}>
          <CustomTimeDropdown
            data={hours}
            locale={locale}
            defaultValue={timeParts?.hours}
            selectedRowStyle={styles.selectedRow}
            onSelect={(selectedItem, index) => {
              time.setHours(isPM && selectedItem !== 12
                ? selectedItem + 12
                : !isPM && selectedItem === 12
                  ? 0
                  : selectedItem
              );
              setTime(new Date(time));
            }}
          />
          <CustomTimeDropdown
            data={minutes}
            locale={locale}
            defaultValue={timeParts?.minutes}
            selectedRowStyle={styles.selectedRow}
            onSelect={(selectedItem, index) => {
              time.setMinutes(selectedItem);
              setTime(new Date(time));
            }}

          />
          <CustomTimeDropdown
            data={timePeriod}
            locale={locale}
            defaultValue={timeParts?.period}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, timeParts?.period)
              time?.setHours(selectedItem === 'PM' && timeParts?.hours !== 12
                ? timeParts?.hours + 12
                : selectedItem === 'AM' && timeParts?.hours === 12
                  ? 0
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
    const isDisabled = isDateRange && (!date || !endDate) ||
      (showPickDate && !date) ||
      (showPickTime && !time);
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
  selectedRow: {
    backgroundColor: colors.earlyDawn,
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
const minutes = [...Array(60).keys()].filter(it => it % 5 === 0);
const timePeriod = ['AM', 'PM'];