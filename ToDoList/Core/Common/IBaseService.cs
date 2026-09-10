
namespace API.Core.Common
{
    public interface IBaseService<T> where T : class
    {
        Task<IQueryable<T>> GetList();
        Task<T> Get(int id);
        Task Add(T t);
        Task Update(T t);
        Task Delete(int id);
    }

}
