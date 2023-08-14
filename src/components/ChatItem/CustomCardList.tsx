import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BubbleProps } from 'react-native-gifted-chat';
import { CustomIMessage } from '../../';
import { s, st, vs } from '../../utils';
import { ButtonObjects, CardObjects } from '../../services';
import { isIOS } from '../../utils/constants/constants';
import colors from '../../utils/theme/colors';
import Lightbox, { LightboxProps } from 'react-native-lightbox-v2'
import Spacer from '../CustomView/Spacer';
import CustomImage from '../CustomView/CustomImage';

export type CustomCardListProps = BubbleProps<CustomIMessage> & {
    onButtonPress?: (btnData: ButtonObjects, idx?: number) => any;
    // lightboxProps?: LightboxProps;
}
const IMAGE_DEFAULT_HEIGHT = vs(112);

const CustomCardList: React.FC<CustomCardListProps> = ({
    onButtonPress,
    // lightboxProps,
    ...restProps
}) => {


    const renderCardItem = (itm: CardObjects, idx: number) => {
        return (
            <View key={`card-item-${itm?.title}-${idx}`} style={styles.card}>
                <View style={styles.contentWrapper}>
                    {itm?.['image-url'] ? (
                        <CustomImage uri={itm?.['image-url']} fixedHeight={IMAGE_DEFAULT_HEIGHT}/>
                    ) : undefined}
                    <Spacer height={10} />
                    <Text style={styles.title}>{itm?.title}</Text>
                    <Spacer height={10} />
                    <Text style={styles.subTitle}>{itm?.['sub-title']}</Text>
                    <Spacer height={10} />

                    {itm?.buttons?.map((btn, bIdx) => {
                        return (
                            <TouchableOpacity
                                key={`card-btn-${btn?.label}-${bIdx}`}
                                style={styles.cardButton}
                                onPress={() => {
                                    onButtonPress?.(btn, idx);
                                }}>
                                <Text style={styles.buttonText}>{btn?.label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

            </View>
        );
    };
    return (
        <FlatList
            horizontal
            style={styles.flatList}
            contentContainerStyle={styles.flexGrowOne}
            data={restProps?.currentMessage?.cards ?? []}
            renderItem={({ item: it, index: idx }) => {
                return renderCardItem(it, idx);
            }}
        />
    );
}

export default CustomCardList;

const styles = StyleSheet.create({
    flexGrowOne: {
        flexGrow: 1,
    },
    flatList: {
        flex: 1,
        minHeight: vs(140),
    },
    card: {
        width: s(237),
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: st(5),
        padding: st(10),
        marginHorizontal: s(10),
    },
    contentWrapper: {
        width: '100%',
        backgroundColor: colors.porcelian,
    },
    image: {
        // width: s(214),
        height: vs(137),
        borderRadius: st(5),
        margin: st(3),
        resizeMode: 'cover',
    },
    imageActive: {
        flex: 1,
        resizeMode: 'contain',
    },
    cardButton: {
        minHeight: vs(36),
        backgroundColor: colors.white,
        borderRadius: st(20),
        paddingVertical: vs(10),
        paddingHorizontal: s(8),
        marginHorizontal: s(8),
        marginBottom: vs(8),
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: colors.shark,
        fontWeight: isIOS ? '700' : 'bold',
        fontSize: st(14),
        lineHeight: st(20),
        letterSpacing: -0.02,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    title: {
        color: colors.shark,
        fontWeight: isIOS ? '700' : 'bold',
        fontSize: st(14),
        lineHeight: st(20),
        letterSpacing: -0.02,
        textAlign: 'center',
        textAlignVertical: 'center',
        alignSelf: 'flex-start',
    },
    subTitle: {
        color: colors.shark,
        fontWeight: isIOS ? '600' : 'bold',
        fontSize: st(12),
        lineHeight: st(20),
        letterSpacing: -0.02,
        textAlign: 'center',
        textAlignVertical: 'center',
        alignSelf: 'flex-start',
    },
});