export function hash(len: number=10):string{
    let numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
    let chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    let hashString = ''
    for(let i = 0; i < len; i++){
        if(Math.floor(Math.random() * 10) % 2 === 0){
            hashString += numbers[Math.floor(Math.random() * 10)]
        }else {
            let char = chars[Math.floor(Math.random() * 26)]
            if(Math.floor(Math.random() * 10) % 2 === 0){
                char = char.toLowerCase()
                hashString += char
            }
        }
    }
    return hashString
}

// 获取光标位置，在点击一些快捷操作的时候我们需要或许当前的光标位置，然后插入具体内容
export function getCursorPosition(el: HTMLTextAreaElement): Array<number>{
    let {selectionStart, selectionEnd} = el
    return [selectionStart, selectionEnd]
}