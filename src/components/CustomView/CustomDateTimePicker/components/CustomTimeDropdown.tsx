import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { s, st, vs } from '../../../../utils';
import SelectDropdown, { SelectDropdownProps } from 'react-native-select-dropdown';
import colors from '../../../../utils/theme/colors';
import { isIOS } from '../../../../utils/constants/constants';
import images from '../../../../utils/theme/image';
import { TxKeyPath, translate } from '../../../../i18n';

export type CustomTimeDropdownProps = SelectDropdownProps & {
  locale?: string;
};

const CustomTimeDropdown: React.FC<CustomTimeDropdownProps> = ({
  buttonStyle, locale, ...restProps
}) => {

  const renderTextLabel = (item: string | number, _index: number) => {
    const valStr = typeof item === 'number' && item < 10
      ? `0${item}`
      : item?.toString();

    return (
      <Text style={styles.text}>
        {translate(valStr as TxKeyPath, undefined, locale)}
      </Text>
    );
  };
  const renderTextItem = (item: string | number, index: number) => {
    const valStr = typeof item === 'number' && item < 10
      ? `0${item}`
      : item?.toString();

    return (
      <View style={styles.textItem}>
        <Text style={[styles.text, styles.opionText]}>
          {translate(valStr as TxKeyPath, undefined, locale)}
        </Text>
      </View>
    );
  };

  const renderSelectedContent = (
    selectedItem: string | number,
    index: number,
  ) => {
    return (
      <View style={styles.rowContainer}>
        {renderTextLabel(selectedItem, index)}
        <Image source={images.ic_arrow_down} resizeMode={'contain'} style={styles.arrowDown}/> 
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SelectDropdown
        {...restProps}
        buttonStyle={[styles.button, buttonStyle ]}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem
        }}
        rowTextForSelection={(item, index) => {
          return item
        }}
        renderCustomizedButtonChild={(selectedItem, index) =>
          renderSelectedContent(selectedItem, index)
        }
        renderCustomizedRowChild={(item, index) => renderTextItem(item, index)}
      />

    </View>
  )

}

export default CustomTimeDropdown;

const styles = StyleSheet.create({
  container: {},
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(6),
  },
  button: {
    flexGrow: 1,
    height: s(30),
    width: s(68),
    paddingVertical: vs(5),
    backgroundColor: colors.porcelian,
    borderWidth: st(1),
    borderColor: colors.cornflowerBlue,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(6),
  },
  textItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(6),
  },
  text: {
    fontSize: s(12),
    color: colors.black,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  opionText: {
    flex: 1,
    fontWeight: isIOS ? '700' : 'bold',
    alignSelf: 'center',
  },
  arrowDown: {
    width: st(10),
    height: st(10),
  }
});
