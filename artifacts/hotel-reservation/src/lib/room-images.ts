export const ROOM_IMAGE_BY_ID: Record<string, string> = {
    r1: 'https://images.unsplash.com/photo-1631049552240-59c37f38802b?q=80&w=1200&auto=format&fit=crop',
    r2: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200&auto=format&fit=crop',
    r3: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=1200&auto=format&fit=crop',
    r4: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop',
    r5: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1200&auto=format&fit=crop',
    r6: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop',
    r7: 'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?q=80&w=1200&auto=format&fit=crop',
    r8: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200&auto=format&fit=crop',
    r9: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1200&auto=format&fit=crop',
    r10: 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?q=80&w=1200&auto=format&fit=crop',
    r11: 'https://images.unsplash.com/photo-1468824357306-a439d58ccb1c?q=80&w=1200&auto=format&fit=crop',
    r12: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop',
    r13: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop',
    r14: 'https://images.unsplash.com/photo-1560448075-bb485b067938?q=80&w=1200&auto=format&fit=crop',
    r15: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1200&auto=format&fit=crop',
};

export function getRoomImageById(roomId: string): string | undefined {
    return ROOM_IMAGE_BY_ID[roomId];
}
