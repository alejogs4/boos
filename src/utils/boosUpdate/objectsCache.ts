export class ObjectsCache<Content> {
  private data: Array<Content>;

  constructor(data: Array<Content>) {
    this.data = data;
  }

  get(element: Content): Content | undefined {
    return this.data.find((el) => el === element);
  }

  add(element: Content) {
    this.data.push(element);
  }

  remove(element: Content) {
    const index = this.data.findIndex((el) => el === element);
    if (index === -1) return;

    this.data = this.data.filter((_, i) => i !== index);
  }
}
