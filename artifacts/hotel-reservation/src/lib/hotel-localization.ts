import { AddOn, Hotel, RoomType } from '../types';
import { AppLanguage } from './i18n';

type LocalizedHotelText = Pick<Hotel, 'location' | 'description'>;
type LocalizedRoomText = Pick<RoomType, 'name' | 'bedType' | 'description'>;

const AR_HOTEL_TEXT_BY_ID: Record<string, LocalizedHotelText> = {
    h1: {
        location: 'باريس، فرنسا',
        description: 'ملاذ ساحر وهادئ وأنيق في قلب باريس. يقف لو موريس كجوهرة بين فنادق القصور الفرنسية، حيث يمزج بين فخامة القرن الثامن عشر والأناقة العصرية.',
    },
    h2: {
        location: 'طوكيو، اليابان',
        description: 'يعد أمان طوكيو أيقونة في العاصمة اليابانية الحديثة، وهو مساحة هادئة للانغماس في السكينة فوق إيقاع المدينة الديناميكي.',
    },
    h3: {
        location: 'بالي، إندونيسيا',
        description: 'يقع هذا المخيم الفاخر وسط الغابات الخضراء الكثيفة، وينسجم بتناغم تام مع الطبيعة المحيطة في قلب أوبود.',
    },
    h4: {
        location: 'سانتوريني، اليونان',
        description: 'منحوت في جانب الجرف، يقدم كانافيس أويا أجنحة أنيقة مع مسابح خاصة وإطلالات آسرة على الكالديرا.',
    },
    h5: {
        location: 'نيويورك، الولايات المتحدة',
        description: 'واحة فاخرة في تريبيكا توفر خصوصية استثنائية، وتصميما داخليا مخصصا، ومنتجعا صحيا هادئا تحت الأرض.',
    },
};

const AR_ROOM_TEXT_BY_ID: Record<string, LocalizedRoomText> = {
    r1: {
        name: 'غرفة سوبيريور',
        bedType: 'سرير كوين',
        description: 'غرفة أنيقة بإطلالات على الفناء الداخلي.',
    },
    r2: {
        name: 'غرفة ديلوكس',
        bedType: 'سرير كينج',
        description: 'غرفة واسعة بديكور باريسي كلاسيكي.',
    },
    r3: {
        name: 'جناح بريستيج',
        bedType: 'سرير كينج',
        description: 'جناح فاخر مع منطقة معيشة منفصلة وإطلالات على حدائق التويلري.',
    },
    r4: {
        name: 'غرفة ديلوكس',
        bedType: 'سرير كينج',
        description: 'غرفة واسعة بلمسات جمالية يابانية تقليدية.',
    },
    r5: {
        name: 'غرفة بريميير',
        bedType: 'سرير كينج',
        description: 'غرفة زاوية بإطلالات بانورامية واسعة على أفق المدينة.',
    },
    r6: {
        name: 'جناح أمان',
        bedType: 'سرير كينج',
        description: 'جناح واسع يوفر أعلى مستويات الراحة في ملاذ حضري هادئ.',
    },
    r7: {
        name: 'خيمة التراس',
        bedType: 'سرير كينج',
        description: 'خيمة فاخرة مع سطح خاص يطل على الغابة.',
    },
    r8: {
        name: 'خيمة النهر',
        bedType: 'سرير كينج',
        description: 'خيمة واسعة تقع بالقرب من نهر ووس.',
    },
    r9: {
        name: 'النزل',
        bedType: 'سريران كينج',
        description: 'نزل بغرفتي نوم مثالي للعائلات أو الأصدقاء.',
    },
    r10: {
        name: 'جناح كلاسيكي',
        bedType: 'سرير كوين',
        description: 'جناح بتصميم بسيط وإطلالات على بحر إيجه.',
    },
    r11: {
        name: 'جناح مع مسبح غطس',
        bedType: 'سرير كينج',
        description: 'جناح يضم مسبح غطس خاصا على التراس.',
    },
    r12: {
        name: 'جناح مسبح نهري',
        bedType: 'سرير كينج',
        description: 'جناح مميز مع مسبح كهفي بتصميم نهري فريد.',
    },
    r13: {
        name: 'غرفة الفناء',
        bedType: 'سرير كوين',
        description: 'غرفة هادئة تطل على الفناء الداخلي الأخضر.',
    },
    r14: {
        name: 'جناح تريبيكا',
        bedType: 'سرير كينج',
        description: 'جناح واسع بإطلالات على الحي ومنطقة جلوس مريحة.',
    },
    r15: {
        name: 'بنتهاوس',
        bedType: 'سرير كينج',
        description: 'بنتهاوس مذهل مع تراس خاص وإطلالات على أفق المدينة.',
    },
};

const AR_ADD_ON_NAME_BY_ID: Record<string, string> = {
    a1: 'سرير إضافي',
    a2: 'يشمل الإفطار',
    a3: 'تسجيل مغادرة متأخر',
};

export function getLocalizedHotelText(
    hotel: Pick<Hotel, 'id' | 'location' | 'description'>,
    language: AppLanguage,
): LocalizedHotelText {
    if (language === 'AR' && AR_HOTEL_TEXT_BY_ID[hotel.id]) {
        return AR_HOTEL_TEXT_BY_ID[hotel.id];
    }

    return {
        location: hotel.location,
        description: hotel.description,
    };
}

export function getLocalizedRoomText(
    room: Pick<RoomType, 'id' | 'name' | 'bedType' | 'description'>,
    language: AppLanguage,
): LocalizedRoomText {
    if (language === 'AR' && AR_ROOM_TEXT_BY_ID[room.id]) {
        return AR_ROOM_TEXT_BY_ID[room.id];
    }

    return {
        name: room.name,
        bedType: room.bedType,
        description: room.description,
    };
}

export function getLocalizedAddOnName(
    addOn: Pick<AddOn, 'id' | 'name'>,
    language: AppLanguage,
): string {
    if (language === 'AR' && AR_ADD_ON_NAME_BY_ID[addOn.id]) {
        return AR_ADD_ON_NAME_BY_ID[addOn.id];
    }

    return addOn.name;
}
